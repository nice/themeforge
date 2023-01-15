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

`;
}

export { getLicense, getLoaders, getOverrides, getHeader, getFooter };
