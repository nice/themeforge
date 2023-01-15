function getLicense() {
  const license = `
" If you are distributing this theme, please replace this comment
" with the appropriate license attributing the original VS Code
" theme author.
`;

  return license;
}

function getHeader(that) {
  return `

" ${that.themeName} - A nice ${that.themeType} theme

" Reset
hi clear
if exists('syntax_on') | syntax reset | endif
set background=dark
let g:colors_name = 'foo-bar'

function! s:h(face, guibg, guifg, ctermbg, ctermfg, gui)
  let l:cmd="highlight " . a:face
  
  if a:guibg != ""
    let l:cmd = l:cmd . " guifg=" . a:guifg
  endif

  if a:guibg != ""
    let l:cmd = l:cmd . " guibg=" . a:guibg
  endif

  if a:ctermbg != ""
    let l:cmd = l:cmd . " ctermbg=" . a:ctermbg
  endif

  if a:ctermfg != ""
    let l:cmd = l:cmd . " ctermfg=" . a:ctermfg
  endif

  if a:gui != ""
    let l:cmd = l:cmd . " gui=" . a:gui
  endif

  exec l:cmd
endfun

" Colors dictionary

" hex colors
let s:hex = {}

" 8-bit colors
let s:bit = {}

`;
}

function getFooter() {
  return `" footer ends here`;
}

function getOverrides(that) {
  return "";
  return `


(custom-theme-set-variables
  '${that.cleanThemeName}
  '(linum-format " %3i "))

`;
}

function getLoaders(that) {
  return "";
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
