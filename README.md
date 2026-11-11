# CV

Personal CV website: an animated one-page presentation plus a printable PDF version.
Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Where things are

| File | What it is |
| --- | --- |
| `js/content.js` | **All the text.** Name, about, projects, skills, education, contact. Edit this to change the site. |
| `index.html` | The website: page skeleton and section order. |
| `css/styles.css` | Look and motion of the website. Colours are at the top under `:root`. |
| `js/main.js` | Builds the page from `content.js` and runs the animations. |
| `js/stl-viewer.js` | Small WebGL viewer that shows a binary `.stl` file as a live 3D model in a project card. |
| `cv.html`, `css/print.css`, `js/cv-print.js` | The printable CV, built from the same `content.js`. |
| `assets/cv.pdf` | The file behind the "Download CV" button. A print of `cv.html`. |
| `assets/profile.jpg` | Portrait photo (4:5, 960 × 1200). |
| `assets/projects/` | Project pictures. |
| `assets/models/` | 3D models (binary STL) shown by the viewer. |

## Changing the content

Edit `js/content.js`. A list left empty (`[]`) hides its section, both on the page and in the menu.
`experience` is empty for now and has a commented example showing the shape to fill in.

A project can carry a picture (`image`) or a 3D model (`model`, a binary `.stl`). Its `role` line says
what you did yourself, `highlights` holds up to three key numbers, and `short` is the one-sentence
version used in the PDF. The 3D model needs the site to be served over http(s); opened straight from
disk the card falls back to a plain header.

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
