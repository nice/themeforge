import Editor from "./editor";
import {
  getHeader,
  getFooter,
  getLoaders,
  getLicense,
  getOverrides,
} from "./emacs.snippets";

class Emacs extends Editor {
  constructor(json) {
    super(json);

    this.editor = "emacs";
    this.commentPrefix = ";; ";
    this.facesBlockBefore = `\n(custom-theme-set-faces\n'${this.cleanThemeName}`;
    this.facesBlockAfter = `)`;

    this.getHeader = getHeader;
    this.getFooter = getFooter;
    this.getLoaders = getLoaders;
    this.getLicense = getLicense;
    this.getOverrides = getOverrides;
  }

  renderFace(key, { background, foreground, fontStyle }) {
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

  renderColors() {
    let vars = "";

    Object.entries(this.colorMap).forEach((entry) => {
      let [hex, colorName] = entry;
      vars += `(${colorName} "${hex}")\n`;
    });

    let output = `\n(let (\n${vars})\n\n`;
    return output;
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
}

export default Emacs;
