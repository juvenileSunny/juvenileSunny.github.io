# MJM Sunny — single-page portfolio

A responsive, static portfolio for GitHub Pages. Every section lives in its own HTML file; `build.py` combines them into the included `index.html`. All content is in the generated HTML, so visitors do not depend on JavaScript or runtime requests to read it.

## Publish

1. Extract this ZIP and copy the **contents** of the `portfolio` folder into your GitHub Pages repository root, beside your existing `images` folder. Back up your existing files before replacing them.
2. Commit `index.html`, `assets/`, and `.nojekyll`. Also commit `sections/`, `template.html`, and `build.py` if you want the editable sources in your repository.
3. Use your repository's GitHub Pages branch publishing configuration with the repository root as the source. The included `index.html` is already built; no build service, Node.js, or Python runtime is needed for hosting.

All local URLs are relative, so this works for both `username.github.io` and `username.github.io/project/`. The ZIP has not been published to your repository.

## Edit one section

Edit its file in `sections/`, then run this command from the portfolio directory:

```sh
python build.py
```

Commit the rebuilt `index.html` along with your changes. Python 3 uses only its standard library. On Windows, `py build.py` also works. You can alternatively edit `index.html` directly, but a later build will overwrite those direct edits.

| File | Section |
| --- | --- |
| `sections/home.html` | Introduction |
| `sections/about.html` | About |
| `sections/research.html` | All nine research, publication, and project entries |
| `sections/experience.html` | All seven professional and community roles |
| `sections/academics.html` | All five education entries |
| `sections/achievements.html` | All eight training and certification entries |
| `sections/contact.html` | Email, phone, location, and social links |

`template.html` contains the page metadata, header, navigation, and footer. `assets/styles.css` contains colors and responsive layouts. `assets/main.js` adds the mobile menu, active navigation, and optional image loading.

## Images

Only HTML files were supplied. Copy the original image files into `images/` using the exact case-sensitive names listed in `images/ASSETS.txt`. They will appear automatically, and missing files leave no empty image frames. The site works without those images. Optional education and experience images require JavaScript; the text and links do not. Research and certifications use text-only lists with thin separators.

The original robot model was not supplied. The new home section uses a CSS illustration with no external dependency. The original model-viewer has not been included.

## Preview

Open `index.html` directly in a browser, or run:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. Mobile navigation, reduced-motion preferences, keyboard focus, skip navigation, and print styles are included. Long sections expand naturally without clipping or forced scroll snapping.

## Content note

The supplied section text, dates, publication descriptions, and external destinations have been retained. The introductory hero was rewritten using the supplied information. Publication destinations and biographical claims were not independently verified. In particular, the Teaching Assistant dates remain **Aug 2023 – Dec 2025**, as supplied; check that range before publishing.
