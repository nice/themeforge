import "./styles/main.scss";
import { getJson } from "./utils/common";
import UI from "./ui";
import Emacs from "./emacs";
import Vim from "./vim";
import ClipboardJS from "clipboard";
import { saveAs } from "file-saver";

const ui = new UI();

const downloadData = {
  fileContent: "",
  fileName: "empty.txt",
};

new ClipboardJS(".clip", {
  text: function (trigger) {
    trigger.innerText = "Copied";
    setTimeout(() => (trigger.innerText = "Copy"), 2000);
  },
});

function generate(editor, input) {
  let { error, json } = getJson(input);

  if (error) {
    ui.showError("Entered json is invalid, please clear and paste again.");
    console.log("Invalid JSON");
    return;
  }

  // start
  if (editor === "emacs") {
    const emacs = new Emacs(json);
    let { themeData, colorMap, usage, cleanThemeName } = emacs.convert();
    ui.setResults(themeData, colorMap, usage, "Emacs");
    downloadData.fileContent = themeData;
    downloadData.fileName = `${cleanThemeName}-theme.el`;
  } else if (editor === "vim") {
    const vim = new Vim(json);
    let { themeData, colorMap, usage, cleanThemeName } = vim.convert();
    ui.setResults(themeData, colorMap, usage, "Vim");
    downloadData.fileContent = themeData;
    downloadData.fileName = `${cleanThemeName}.vim`;
  }
}

function download() {
  var file = new File([downloadData.fileContent], downloadData.fileName, {
    type: "text/plain;charset=utf-8",
  });
  saveAs(file);
}

function init() {
  ui.clearResults();
  const { editor, input } = ui.getInputs();
  generate(editor, input);
}

function handleSubmit(e) {
  ui.clearHelp();

  const { editor, input } = ui.getInputs();
  generate(editor, input);
  e.preventDefault();
}

// Event listeners
document
  .querySelector(ui.selectors.form)
  .addEventListener("submit", handleSubmit);

document
  .querySelector(ui.selectors.input)
  .addEventListener("input", function () {
    ui.clearResults();
    ui.showHelp();
  });

document.querySelectorAll(ui.selectors.radios).forEach((radio) => {
  radio.addEventListener("change", function () {
    ui.clearResults();
    ui.showHelp();
  });
});

document
  .querySelector(ui.selectors.download)
  .addEventListener("click", function (e) {
    download();
    e.preventDefault();
  });

document
  .querySelector(ui.selectors.clear)
  .addEventListener("click", function (e) {
    ui.clearInput();
    e.preventDefault();
  });

document.addEventListener("DOMContentLoaded", init);
