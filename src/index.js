import "./styles/main.scss";
import { getJson } from "./utils/common";
import Emacs from "./emacs";
import Vim from "./vim";
import ClipboardJS from "clipboard";

new ClipboardJS(".clip", {
  text: function (trigger) {
    trigger.innerText = "Copied";
    setTimeout(() => (trigger.innerText = "Copy"), 2000);
  },
});

function handleSubmit(e) {
  const inputText = document.querySelector("#input-text").value;
  let { err, json } = getJson(inputText);

  if (!err) {
    // const emacs = new Emacs(json);
    // let { themeData, colorMap } = emacs.convert();
    // document.querySelector("#output").innerHTML = themeData;
    // // console.log(colorMap);
    // emacs.log();

    const vim = new Vim(json);
    let { themeData, colorMap } = vim.convert();
    document.querySelector("#output").innerHTML = themeData;
    console.log(colorMap);
    vim.log();
  } else {
    console.log("Invalid json");
  }
  // Emacs
  e.preventDefault();
}

document.querySelector("#input-form").addEventListener("submit", handleSubmit);
document.addEventListener("DOMContentLoaded", handleSubmit);
