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

" ==========> Reset
set background=${that.themeType}

hi clear

if exists("syntax_on")
  syntax reset
endif

let g:colors_name = '${that.cleanThemeName}'

" ==========> Highlight function
function! s:h(face, guibg, guifg, ctermbg, ctermfg, gui)
  let l:cmd="highlight " . a:face
  
  if a:guibg != ""
    let l:cmd = l:cmd . " guibg=" . a:guibg
  endif

  if a:guifg != ""
    let l:cmd = l:cmd . " guifg=" . a:guifg
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


" ==========> Colors dictionary

" GUI colors dictionary (hex)
let s:hex = {}
" Terminal colors dictionary (256)
let s:bit = {}

`;
}

function getFooter() {
  return `
" Generated with https://github.com/nice/themehopper
highlight link cStatement Statement
highlight link cSpecial Special
`;
}

function getOverrides(_) {
  return "";
}

function getLoaders(_) {
  return "";
}

export { getLicense, getLoaders, getOverrides, getHeader, getFooter };
