class UI {
  constructor() {
    this.selectors = {
      form: "#form",
      input: "#input",
      result: "#result",
      resultTheme: "#result-theme",
      resultColors: "#result-colors",
      resultUsage: "#result-usage",
      radios: 'input[name="editor"]',
      editorName: "#editor-name",
      download: "#download",
      inputHelp: "#input-help",
      clear: "#clear",
    };
  }

  getInputs() {
    const $form = document.querySelector(this.selectors.form);
    const editor = $form.elements["editor"].value;
    const input = document.querySelector(this.selectors.input).value;

    return { editor, input };
  }

  clearInput() {
    document.querySelector(this.selectors.input).value = "";
    this.clearResults();
  }

  setResults(themeData, colorMap, usage, editorName) {
    document.querySelector(this.selectors.result).classList.remove("is-hidden");

    // set editor name
    document.querySelector(this.selectors.editorName).textContent = editorName;

    // set theme data
    document.querySelector(this.selectors.resultTheme).innerText = themeData;

    // display theme colors
    let html = `<div class="columns is-mobile">`;
    let count = 0;
    let perColumn = 4;

    Object.entries(colorMap).forEach((entry, index) => {
      let [hex, colorName] = entry;
      count = index + 1;

      html += `
<div class="column">
${colorName}: <span style="background: ${hex}"></span>
</div>
`;
      if (count % perColumn === 0 && count !== 1) {
        html += `</div><div class="columns is-mobile">`;
      }
      // console.log(count, html);
    });

    if (count % perColumn !== 0) {
      console.log(count);
      // fill extra space
      for (let i = 0; i < 4 - (count % perColumn); i++) {
        html += `<div class="column"></div>`;
      }
      html += `</div>`;
    }

    document.querySelector(this.selectors.resultColors).innerHTML = html;

    // display usage
    document.querySelector(this.selectors.resultUsage).innerHTML = usage;
  }

  clearResults() {
    document.querySelector(this.selectors.result).classList.add("is-hidden");
  }

  showHelp() {
    document
      .querySelector(this.selectors.inputHelp)
      .classList.remove("is-hidden");
  }

  clearHelp() {
    document.querySelector(this.selectors.inputHelp).classList.add("is-hidden");
  }

  getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  }
}

export default UI;
