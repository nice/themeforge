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
function fooshadeColor(color, percent) {
  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R / 10) * 10;
  G = Math.round(G / 10) * 10;
  B = Math.round(B / 10) * 10;

  var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

const colorShade = (col, amt) => {
  // empty color check
  if (col === "") return col;

  col = col.replace(/^#/, "");
  if (col.length === 3)
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [
    parseInt(r, 16) + amt,
    parseInt(g, 16) + amt,
    parseInt(b, 16) + amt,
  ];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? "0" : "") + r;
  const gg = (g.length < 2 ? "0" : "") + g;
  const bb = (b.length < 2 ? "0" : "") + b;

  return `#${rr}${gg}${bb}`;
};
export { getJson, parseTheme, cleanString, colorShade as shadeColor };
