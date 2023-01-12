import "./main.scss";
import { getJson, parseTheme } from "./utils";
import Emacs from "./emacs";

function handleSubmit(e) {
  const inputText = document.querySelector("#input-text").value;
  let { err, json } = getJson(inputText);

  if (!err) {
    console.time("foo");
    const emacs = new Emacs(json);
    let {themeData, colorMap} = emacs.convert();
    document.querySelector("pre").innerText = themeData;
    console.log(colorMap);
  } else {
    console.log("Invalid json");
  }
  // Emacs
  e.preventDefault();
}

document.querySelector("#input-form").addEventListener("submit", handleSubmit);
