function getLicense() {
  const license = `
;; If you are distributing this theme, please replace this comment
;; with the appropriate license attributing the original VS Code
;; theme author.
`;

  return license;
}

function getOverrides(cleanThemeName) {
  return `


(custom-theme-set-variables
  '${cleanThemeName}
  '(linum-format " %3i "))

`;
}

function getLoaders(cleanThemeName) {
  return `
;;;###autoload
(when load-file-name
  (add-to-list 'custom-theme-load-path
               (file-name-as-directory (file-name-directory load-file-name))))


;;;###autoload
(defun ${cleanThemeName}-theme()
  "Apply the ${cleanThemeName}-theme."
  (interactive)
  (load-theme '${cleanThemeName} t))


(provide-theme '${cleanThemeName})


;; Local Variables:
;; no-byte-compile: t
;; End:

`;
}

export { getLicense, getLoaders, getOverrides };
