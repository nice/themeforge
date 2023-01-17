import { parseTheme, cleanString } from "./utils/common";
import hex2bit from "./utils/hex2bit";
import shadeHex from "./utils/shadeHex";

class Editor {
  constructor(json) {
    const data = parseTheme(json);

    this.themeName = data.themeName;
    this.themeType = data.themeType;
    this.themeColors = data.themeColors;
    this.themeScope = data.themeScope;

    this.hexCounter = 0;
    this.bitCounter = 0;
    this.editorScope = {};
    this.hexColorMap = {};
    this.bitColorMap = {};
    this.cleanThemeName = cleanString(this.themeName);

    // IMPORTANT: override below variables and methods from child class
    this.settings = "[warning: settings is not set]";
    this.editor = "[warning: editor not set]";
    this.commentPrefix = "[warning: commentPrefix not set]";

    this.facesBlockBefore = "[warning: facesBlockBefore is not set]";
    this.facesBlockAfter = "[warning: facesBlockAfter is not set]";
  }

  getHeader() {
    throw new Error("Not implemented");
  }

  getFooter() {
    throw new Error("Not implemented");
  }

  getLoaders() {
    throw new Error("Not implemented");
  }
  getLicense() {
    throw new Error("Not implemented");
  }
  getOverrides() {
    throw new Error("Not implemented");
  }

  resolveStyle() {
    throw new Error("Not implemented");
  }

  renderFace() {
    throw new Error("Not implemented");
  }

  renderColors() {
    throw new Error("Not implemented");
  }

  convert() {
    let output = "";

    // main
    let toRender = [];
    this.settings.forEach((config) => {
      toRender.push(this.resolveConfig(config));
    });

    let main = "";
    main = this.renderConfig(toRender);

    let faces = this.facesBlockBefore + main + this.facesBlockAfter;

    // colors
    let colors = this.renderColors();

    // header
    let header = this.renderHeader();

    // footer
    let footer = this.renderFooter();

    output = header + colors + faces + footer;

    return {
      themeData: output,
      colorMap: this.hexColorMap,
      usage: this.getUsage(),
      cleanThemeName: this.cleanThemeName,
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
        let result = this.renderFace(item.key, this.editorScope[item.key]);
        output = result.length ? output + result + "\n" : output;
      } else if (item.type === "comment") {
        output += `\n\n${this.commentPrefix}${item.description}\n`;
      }
    });

    return output;
  }

  getHexKey(hex) {
    if (this.hexColorMap[hex] === undefined) {
      this.hexColorMap[hex] = "color" + this.hexCounter;
      this.hexCounter++;
    }

    return this.hexColorMap[hex];
  }

  getBitKey(hex) {
    // first convert hex to closest 8-bit
    let bit = hex2bit(hex);

    if (this.bitColorMap[bit] === undefined) {
      this.bitColorMap[bit] = "color" + this.bitCounter;
      this.bitCounter++;
    }

    return this.bitColorMap[bit];
  }

  renderHeader() {
    let header = "";

    header += this.getLicense();

    header += this.getHeader(this);

    return header;
  }

  renderFooter() {
    let footer = this.getFooter();

    let overrides = this.getOverrides(this);
    footer += overrides;

    let loaders = this.getLoaders(this);
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

      // Editor flow
      // We cannot reosolve now because it can have dependencies on other faces
      if (editor === this.editor) {
        color.resolved = false;
        color.resolution = atom;
        break;
      }

      // VS Code flow
      // We can resolve actions instantly
      let scope = this.themeScope[atom];

      // if theme.json does not have this defined
      if (!scope) continue;

      // if a valid scope.base exists, use that
      if (scope.base) {
        if (scope.base.length > 7) continue;
        else {
          color.value = scope.base;

          if (typeof atomAction !== "undefined") {
            color.value = this.applyAction(
              color.value,
              atomAction,
              atomArgument
            );
          }

          break;
        }
      }

      if (scope[atomType]) {
        if (scope[atomType].length > 7) continue;
        else {
          color.value = scope[atomType];
          if (typeof atomAction !== "undefined") {
            color.value = this.applyAction(
              color.value,
              atomAction,
              atomArgument
            );
          }

          break;
        }
      }
    }

    color.action = atomAction;
    color.argument = atomArgument;

    return color;
  }

  applyAction(value, action, argument) {
    let calculatedValue = value;

    // check for actions
    if (action && argument) {
      if (action === "adjust") {
        argument = parseInt(argument);

        // IF the theme is dark: lighten the shade
        // IF the theme is light: darken the shade
        if (this.themeType === "light" || this.themeType !== "dark")
          argument = -argument;

        calculatedValue = shadeHex(value, argument);
      }
    }

    return calculatedValue;
  }

  getUsage() {
    return "";
  }

  log() {
    console.log(this);
  }
}

export default Editor;
