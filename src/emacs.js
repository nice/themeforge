import config from "./emacs.config.json";
import { parseTheme, cleanString } from "./utils";
import { getLoaders, getLicense, getOverrides } from "./emacs.snippets";

class Emacs {
  constructor(json) {
    const data = parseTheme(json);

    this.themeName = data.themeName;
    this.themeType = data.themeType;
    this.themeColors = data.themeColors;
    this.themeScope = data.themeScope;

    this.counter = 0;
    this.colorMap = {};
    this.cleanThemeName = cleanString(this.themeName);
  }

  convert() {
    let output = "";

    // main
    let data = "";
    config.forEach((item) => {
      data += this.renderItem(item);
    });
    let faces = `(custom-theme-set-faces\n'${this.cleanThemeName}\n${data})`;

    // colors
    let colors = this.renderColors();

    // license
    let license = getLicense();

    // header
    let header = this.renderHeader();

    // footer
    let footer = this.renderFooter();

    output = header + colors + faces + footer;

    return {
      themeData: output,
      colorMap: this.colorMap
    }
  }

  renderItem(item) {
    let output = "";

    if (item.type === "face") {
      const isValid = item.foreground || item.background || item.fontStyle;

      if (!isValid) return "";

      let base;
      let foreground = "";
      let background = "";
      let fontStyle = "";

      // foreground
      base = null;
      base = this.themeScope[item.foreground]?.base;

      foreground = base
        ? base
        : this.themeScope[item.foreground]?.foreground
        ? this.themeScope[item.foreground]?.foreground
        : "";

      foreground = foreground.length
        ? ":foreground ," + this.getColorKey(foreground)
        : foreground;

      // background
      base = null;
      base = this.themeScope[item.background]?.base;

      background = base
        ? base
        : this.themeScope[item.background]?.background
        ? this.themeScope[item.background]?.background
        : "";

      background = background.length
        ? ":background ," + this.getColorKey(background)
        : background;

      // fontStyle
      base = null;
      base = this.themeScope[item.fontStyle]?.fontStyle;

      switch (base) {
        case null:
          fontStyle = "";
          break;
        case "":
          fontStyle = ":bold nil :italic nil :underline nil";
          break;
        case "bold":
          fontStyle = ":bold t";
          break;
        case "italic":
          fontStyle = ":italic t";
          break;
        case "underline":
          fontStyle = ":underline t";
          break;
      }

      output = `\`(${item.face} ((t (${foreground} ${background} ${fontStyle}))))\n`;
    }

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

    let output = `(let (\n${vars})\n\n`;
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

  log() {
    console.log(
      this.themeName,
      this.themeType,
      this.themeColors,
      this.themeScope
    );
  }
}

export default Emacs;
