import Editor from "./editor";
import {
  getHeader,
  getFooter,
  getLoaders,
  getLicense,
  getOverrides,
  getInstructions,
} from "./snippets/vim.snippets";
import settings from "./settings/vim.settings.json";

class Vim extends Editor {
  constructor(json) {
    super(json);

    this.settings = settings;
    this.editor = "vim";
    this.commentPrefix = '" ';
    this.facesBlockBefore = "";
    this.facesBlockAfter = "";

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

    const _getHexKey = (item) => {
      if (item.length) {
        return `s:hex.${this.getHexKey(item)}`;
      } else return `""`;
    };

    const _getBitKey = (item) => {
      if (item.length) {
        return `s:bit.${this.getBitKey(item)}`;
      } else return `""`;
    };

    output = `\ncall s:h("${key}", ${_getHexKey(background)}, ${_getHexKey(
      foreground
    )}, ${_getBitKey(background)}, ${_getBitKey(foreground)}, "none")`;

    return output;
  }

  renderColors() {
    let vars = "";

    Object.entries(this.hexColorMap).forEach((entry) => {
      let [hex, colorName] = entry;
      vars += `\nlet s:hex.${colorName}="${hex}"`;
    });

    vars += "\n";

    Object.entries(this.bitColorMap).forEach((entry) => {
      let [hex, colorName] = entry;
      vars += `\nlet s:bit.${colorName}="${hex}"`;
    });

    let output = `${vars}`;
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
  getUsage() {
    return getInstructions(this);
  }
}

export default Vim;
