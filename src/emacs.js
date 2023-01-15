import settings from "./emacs.settings.json";
import { parseTheme, cleanString, shadeColor } from "./utils";
import { getLoaders, getLicense, getOverrides } from "./emacs.snippets";

class Emacs {
  constructor(json) {
    const data = parseTheme(json);

    this.themeName = data.themeName;
    this.themeType = data.themeType;
    this.themeColors = data.themeColors;
    this.themeScope = data.themeScope;

    this.counter = 0;
    this.editorScope = {};
    this.colorMap = {};
    this.cleanThemeName = cleanString(this.themeName);
  }

  convert() {
    let output = "";

    // main
    let toRender = [];
    settings.forEach((config) => {
      toRender.push(this.resolveConfig(config));
    });

    let main = "";
    main = this.renderConfig(toRender);

    let faces = `\n(custom-theme-set-faces\n'${this.cleanThemeName}${main})`;

    // colors
    let colors = this.renderColors();

    // header
    let header = this.renderHeader();

    // footer
    let footer = this.renderFooter();

    output = header + colors + faces + footer;

    return {
      themeData: output,
      colorMap: this.colorMap,
    };
  }

  resolveConfig(config) {
    let output = {};

    if (config.type === "face") {
      const isValid =
        config.foreground?.length ||
        config.background?.length ||
        config.fontStyle;

      if (!isValid) return "";

      let foreground = "";
      let background = "";
      let fontStyle = "";

      // foreground
      foreground = this.resolveColor(config.foreground, "foreground");

      // background
      background = this.resolveColor(config.background, "background");

      // fontStyle
      fontStyle = this.resolveStyle(config);

      output = {
        type: config.type,
        key: config.face,
        foreground: foreground,
        background: background,
        fontStyle: fontStyle,
        description: null,
      };
    } else if (config.type === "comment") {
      output = {
        type: config.type,
        description: config.description,
      };
    }

    return output;
  }

  renderConfig(toRender) {
    // load the resolved items
    toRender.forEach((item) => {
      if (item.type == "face") {
        this.editorScope[item.key] = {
          background: "",
          foreground: "",
          fontStyle: "",
        };

        if (item.background.resolved)
          this.editorScope[item.key].background = this.applyAction(
            item.background.value,
            item.action,
            item.argument
          );

        if (item.foreground.resolved)
          this.editorScope[item.key].foreground = this.applyAction(
            item.foreground.value,
            item.action,
            item.argument
          );

        if (item.fontStyle.resolved)
          this.editorScope[item.key].fontStyle = this.applyAction(
            item.fontStyle.value,
            item.action,
            item.argument
          );
      }
    });

    // resolve and apply actions
    toRender.forEach((item) => {
      if (item.type === "face") {
        if (!item.background.resolved) {
          let [prefix, suffix] = item.background.resolution.split(".");
          let itemValue = this.editorScope[prefix][suffix];
          itemValue = this.applyAction(
            itemValue,
            item.background.action,
            item.background.argument
          );
          this.editorScope[item.key].background = itemValue;
          item.background.resolved = true;
        }

        if (!item.foreground.resolved) {
          let [prefix, suffix] = item.foreground.resolution.split(".");
          let itemValue = this.editorScope[prefix][suffix];
          itemValue = this.applyAction(
            itemValue,
            item.foreground.action,
            item.foreground.argument
          );
          this.editorScope[item.key].foreground = itemValue;
          item.foreground.resolved = true;
        }

        if (!item.fontStyle.resolved) {
          let [prefix, suffix] = item.fontStyle.resolution.split(".");
          let itemValue = this.editorScope[prefix][suffix];
          itemValue = this.applyAction(
            itemValue,
            item.fontStyle.action,
            item.fontStyle.argument
          );
          this.editorScope[item.key].fontStyle = itemValue;
          item.fontStyle.resolved = true;
        }
      }
    });

    // render render render
    let output = "\n";
    toRender.forEach((item) => {
      if (item.type === "face") {
        let result = this.renderItem(item.key, this.editorScope[item.key]);
        output = result.length ? output + result + "\n" : output;
      } else if (item.type === "comment") {
        output += `\n\n;; ${item.description}\n`;
      }
    });

    return output;
  }

  renderItem(key, { background, foreground, fontStyle }) {
    let output = "";
    if (!background.length && !foreground.length && !fontStyle.length)
      return "";

    // start
    if (background.length)
      output += `:background ,${this.getColorKey(background)} `;
    if (foreground.length)
      output += `:foreground ,${this.getColorKey(foreground)} `;
    if (fontStyle.length) output += `:fontStyle ${fontStyle} `;

    output = `\`(${key} ((t (${output}))))`;

    return output;
  }

  getColorKey(hex) {
    if (this.colorMap[hex] === undefined) {
      this.colorMap[hex] = "color" + this.counter;
      this.counter++;
    }

    return this.colorMap[hex];
  }

  renderColors() {
    let vars = "";

    Object.entries(this.colorMap).forEach((entry) => {
      let [hex, colorName] = entry;
      vars += `(${colorName} "${hex}")\n`;
    });

    let output = `\n(let (\n${vars})\n\n`;
    return output;
  }

  renderHeader() {
    let header = "";

    header += getLicense();

    header += `\n(deftheme ${this.cleanThemeName} "A nice ${this.themeType} theme.")\n\n`;

    return header;
  }

  renderFooter() {
    let footer = ")"; // to offset let parens

    let overrides = getOverrides(this.cleanThemeName);
    footer += overrides;

    let loaders = getLoaders(this.cleanThemeName);
    footer += loaders;

    return footer;
  }

  resolveColor(atomArr, atomType) {
    let color = {
      resolved: true,
      resolution: null,
      value: "",
      action: null,
      argument: null,
    };

    let editor, atom, atomAction, atomArgument;

    for (let i = 0; i < atomArr.length; i++) {
      // settings entry follows "editor#atom|action:argument" convention
      const atomRegex = /([a-zA-Z]+)#([a-zA-Z.-]+)\|?([a-zA-Z]+)?:?([0-9-]+)?/;
      const match = atomArr[i].match(atomRegex);
      editor = match[1];
      atom = match[2];
      atomAction = match[3];
      atomArgument = match[4];

      // Emacs flow
      if (editor === "emacs") {
        color.resolved = false;
        color.resolution = atom;
        break;
      }

      // VS Code flow
      let scope = this.themeScope[atom];

      // if theme.json does not have this defined
      if (!scope) continue;

      // if a valid scope.base exists, use that
      if (scope.base) {
        if (scope.base.length > 7) continue;
        else {
          color.value = scope.base;
          break;
        }
      }

      if (scope[atomType]) {
        if (scope[atomType].length > 7) continue;
        else {
          color.value = scope[atomType];
          break;
        }
      }
    }

    color.action = atomAction;
    color.argument = atomArgument;

    return color;
  }

  resolveStyle(config) {
    // action, argument currently not support for font style

    let style = {
      resolved: true,
      resolution: null,
      value: "",
      action: null,
      argument: null,
    };

    // IF fontStyle is null in settings
    if (!config.fontStyle) return style;

    // ELSE
    let key = config.fontStyle.split("#")[1];
    let fontStyle = this.themeScope[key]?.fontStyle;
    let fontStyleString = "";

    switch (fontStyle) {
      case null:
        fontStyleString = "";
        break;
      case "":
        fontStyleString = ":bold nil :italic nil :underline nil";
        break;
      case "bold":
        fontStyleString = ":bold t";
        break;
      case "italic":
        fontStyleString = ":italic t";
        break;
      case "underline":
        fontStyleString = ":underline t";
        break;
    }

    return {
      resolved: true,
      resolution: null,
      value: fontStyleString,
      action: null,
      argument: null,
    };
  }

  applyAction(value, action, argument) {
    let calculatedValue = value;

    // check for actions
    if (action && argument) {
      if (action === "adjust") {
        argument = parseInt(argument);

        // IF the theme is dark: lighten the shade
        // IF the theme is light: darken the shade
        // IF you are sad: you must cheer up buddy :)
        if (this.themeType === "light" || this.themeType !== "dark")
          argument = -argument;

        calculatedValue = shadeColor(value, argument);
      }
    }

    return calculatedValue;
  }

  log() {
    console.log(this);
  }
}

export default Emacs;
