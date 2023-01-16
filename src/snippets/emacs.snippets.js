function getLicense() {
  const license = `
;; If you are distributing this theme, please replace this comment
;; with the appropriate license attributing the original VS Code
;; theme author.
`;

  return license;
}

function getHeader(that) {
  return `\n(deftheme ${that.cleanThemeName} "A nice ${that.themeType} theme.")\n\n`;
}

function getFooter() {
  return ")"; // to offset let parens
}

function getOverrides(that) {
  return `


(custom-theme-set-variables
  '${that.cleanThemeName}
  '(linum-format " %3i "))

`;
}

function getLoaders(that) {
  return `
;;;###autoload
(when load-file-name
  (add-to-list 'custom-theme-load-path
               (file-name-as-directory (file-name-directory load-file-name))))


;;;###autoload
(defun ${that.cleanThemeName}-theme()
  "Apply the ${that.cleanThemeName}-theme."
  (interactive)
  (load-theme '${that.cleanThemeName} t))


(provide-theme '${that.cleanThemeName})


;; Local Variables:
;; no-byte-compile: t
;; End:


;; Generated using https://github.com/nice/themeforge
;; Feel free to remove the above URL and this line.
`;
}

function getInstructions(that) {
  let html = `
<div class="block">
<p class="mb-1">1. Download or create file <span class="tag is-secondary">${that.cleanThemeName}-theme.el</span></p>
<p class="mb-1">2. Move the file to <span class="tag is-secondary">~/.emacs.d/${that.cleanThemeName}-theme.el</span></p>
<p class="mb-1">3. Add this in your <span class="tag is-secondary">~/init.el</span></p>
<pre>
(load "~/.emacs.d/${that.cleanThemeName}-theme.el")
(load-theme '${that.cleanThemeName} t)</pre>
</div>
  `;

  return html;
}

export {
  getLicense,
  getLoaders,
  getOverrides,
  getHeader,
  getFooter,
  getInstructions,
};
