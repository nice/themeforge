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

/* Credits: https://stackoverflow.com/a/13532993/2102830 */
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R / 10) * 10
    G = Math.round(G / 10) * 10
    B = Math.round(B / 10) * 10

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

export { getJson, parseTheme, cleanString, shadeColor };
