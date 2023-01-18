# Themeforge

Generate Emacs and Vim theme from VS Code theme's json file.

- Written in Vanilla JS, conversion happens entirely in browser.
- Can be extended to support other editors.
- Supports few Emacs package faces by default.
- Includes 256 color terminal support for Vim.
- Uses reasonable fallbacks for editor specific features.

# Screenshots

#### Make apps theme (original theme source: https://google.com)
![themeforge - make apps theme](https://res.cloudinary.com/dur0cxkf0/image/upload/r_6/v1674029646/themeforge/themeforge-make-apps-theme_csfmgr.png "themeforge make apps theme")

#### Bluloco Light Theme (original theme source: https://google.com)
![themeforge - bluloco light theme](https://res.cloudinary.com/dur0cxkf0/image/upload/r_6/v1674029646/themeforge/themeforge-bluloco-light-theme_ujssoi.png "themeforge make apps theme")

#### Palenight Theme (original theme source: https://google.com)
![themeforge - palenight theme](https://res.cloudinary.com/dur0cxkf0/image/upload/r_6/v1674029646/themeforge/themeforge-palenight-theme_auwuqg.png "themeforge make apps theme")


# FAQ

See https://nice.github.io/themeforge/faq

# Extending

Please check the folder: https://github.com/nice/themeforge/tree/master/src

The main generation logic is defined in the Editor class inside `editor.js`

Emacs and Vim extends Editor class, see `emacs.js` and `vim.js` inside the same folder

If you need any further help:

Please raise an issue or reach out to jayaram@gmx.com

# Acknowledgments

Thanks to the following authors of the below packages:

- [ample-theme](https://github.com/jordonbiondo/ample-theme)

- [base16-emacs](https://github.com/tinted-theming/base16-emacs)

- [color shading](https://stackoverflow.com/a/62640342/2102830)

- [color approximation](https://stackoverflow.com/a/11770026/2102830)

Also to the authors of VS Code themes used in screenshots. (Links in the heading)

# License

![AGPL](https://res.cloudinary.com/dur0cxkf0/image/upload/v1673972387/themeforge/agplv3-with-text-162x68_q971qo.png "AGPL")

GNU Affero General Public License
