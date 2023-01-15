function getJson(text) {
  let err = false;
  let json = null;

  try {
    json = JSON.parse(text);
  } catch (err) {
    err = true;
    console.log(err);
  }

  return {
    err,
    json,
  };
}

function parseTheme(json) {
  let themeName = "";
  let themeType = "";
  let themeColors = new Set();
  let themeScope = {};
  let themeScopeItem = {
    base: null,
    background: null,
    foreground: null,
    fontStyle: null,
  };

  // name
  themeName = json.name ? json.name : "Unknown Theme";

  // type
  themeType = json.type ? json.type : "";

  // colors: {}
  if (json.colors) {
    Object.entries(json.colors).forEach((entry) => {
      const [key, value] = entry;
      themeScope[key] = { ...themeScopeItem, base: value };
      themeColors.add(value);
    });
  }

  // tokenColors: []
  if (json.tokenColors) {
    json.tokenColors.forEach((entry) => {
      if (typeof entry.scope === "string" && entry.settings) {
        themeScope[entry.scope] = { ...themeScopeItem, ...entry.settings };
      } else if (Array.isArray(entry.scope) && entry.settings) {
        entry.scope.forEach((key) => {
          themeScope[key] = { ...themeScopeItem, ...entry.settings };
        });
      }
    });
  }

  return {
    themeName,
    themeType,
    themeColors,
    themeScope,
  };
}

function cleanString(input) {
  let str = input;

  str = str.replace(/[^a-zA-Z0-9\s]/g, "");
  str = str.trim();
  str = str.replace(/\s+/g, " ");
  str = str.toLowerCase().replaceAll(" ", "-");

  return str;
}


export { getJson, parseTheme, cleanString };
