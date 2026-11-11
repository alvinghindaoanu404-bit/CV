# CV

Personal CV website: an animated one-page presentation plus a printable PDF version.
Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Where things are

| File | What it is |
| --- | --- |
| `js/content.js` | **All the text.** Name, about, education, achievements, skills, contact. Edit this to change the site. |
| `index.html` | The website: page skeleton and section order. |
| `css/styles.css` | Look and motion of the website. Colours are at the top under `:root`. |
| `js/main.js` | Builds the page from `content.js` and runs the animations. |
| `cv.html`, `css/print.css`, `js/cv-print.js` | The printable CV, built from the same `content.js`. |
| `assets/cv.pdf` | The file behind the "Download CV" button. A print of `cv.html`. |
| `assets/profile.jpg` | Portrait photo (4:5, 960 × 1200). |

## Changing the content

Edit `js/content.js`. A list left empty (`[]`) hides its section, both on the page and in the menu.
`experience` and `projects` are empty for now and each has a commented example showing the shape to fill in.

Then refresh the PDF so it matches the site:

```
node scripts/build-pdf.js
```

This needs Playwright (`npm i -D playwright && npx playwright install chromium`).
Without it: open `cv.html` in a browser, choose Print, save as PDF, and store the file as `assets/cv.pdf`.

## Viewing it locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 4173
```

## Publishing

The site is static, so any static host works. With GitHub Pages: repository Settings → Pages →
deploy from the branch that holds these files, folder `/ (root)`.

## Fonts

Space Grotesk, Inter and JetBrains Mono are self-hosted in `assets/fonts` under the SIL Open Font License
(licence texts are alongside the font files).
