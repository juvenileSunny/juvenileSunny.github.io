# MJM Sunny — Research, XR & Interactive Systems

**VR Developer · HCI Researcher · Computer Science Ph.D. Student**

[Explore my portfolio](https://juvenilesunny.github.io/) · [LinkedIn](https://www.linkedin.com/in/jahed-murad-sunny/) · [GitHub](https://github.com/juvenileSunny) · [Email](mailto:msunny@ualr.edu)

I'm **Mohammad Jahed Murad Sunny**, a Ph.D. student in Computer Science at the **University of Arkansas at Little Rock** and a Graduate Research Assistant at the **Emerging Analytics Center**. I build interactive systems and study how people use them, with a focus on virtual reality, human–computer interaction, and behavioral data analysis.

My background began in Electrical and Electronic Engineering at **Chittagong University of Engineering and Technology (CUET)**. After working in cellphone quality control at Walton Digi-Tech, I moved toward computer science and immersive technology. I completed my M.S. in Computer Science and a Graduate Certificate in Data Science at UA Little Rock, where I now continue my doctoral research.

This repository brings together my research, publications, professional experience, and small interactive experiments. It also documents the website structure so others can understand it and adapt the implementation for their own portfolios.

## What I work on

- **Immersive interaction and usability:** investigating how people learn, navigate, and perform precision tasks in virtual environments.
- **Human movement and performance:** analyzing motion precision, user expertise, cognitive load, and behavioral differences in VR.
- **Gaze and interaction analytics:** connecting Unity applications with data pipelines to explore attention and interaction patterns.
- **Interactive systems:** building applications and experiments that connect user input, meaningful feedback, and measurable behavior.

My work uses tools including **Unity, C#, OpenXR, Python, machine learning, and the Elastic Stack**. My research and publications page includes work on VR and gaming expertise, precision performance, spatial decision-making, and real-time gaze analytics.

## Explore the portfolio

| Section | What you will find |
| --- | --- |
| About | My path from electrical engineering to immersive computing |
| Research & Publications | Papers, projects, and research interests |
| Experience | Research, teaching, industry, and community roles |
| Education | My academic background |
| Achievements & Certifications | Technical training and continued learning |
| Games & Experiments | Short browser games exploring attention, timing, precision, and interface design |
| Contact | Ways to connect about research, development, and collaboration |

## Games as interaction experiments

The games offer a hands-on way to explore questions behind HCI: How does a smaller target affect pointing? What happens when a visual search becomes cluttered? How does changing a rule affect response time?

Each game opens in a shared dialog and starts with fresh state. Closing it ends the session. The game modules do not save scores or upload gameplay results.

| Game | Interaction explored | Feedback |
| --- | --- | --- |
| Sliding Puzzle | Spatial arrangement and planning | Moves and completion |
| Target Rush | Fast target selection | Score, accuracy, escaped targets |
| Signal Watch | Detecting a relevant signal among distractors | Hits, misses, false responses, response time |
| Precision Path | Pointer control through constrained paths | Time, boundary crossings, distance |
| Target Switch | Small versus large pointing targets | Time per hit and missed clicks |
| Change Detective | Noticing changes between alternating scenes | Detection time, wrong guesses, timeouts |
| Stop Signal | Responding to GO while withholding responses on stop trials | GO responses, successful stops, response time |
| Rule Switch | Switching between color and shape rules | Errors and switch/repeat response times |
| Quiet Search | Clean versus cluttered search layouts | Search time and errors |
| Rhythm Tracker | Maintaining timing with and without a visible cue | Timing error, missed beats, extra taps |

These are informal interaction demos, not validated cognitive tests or evidence of improved everyday attention. Input device, screen size, practice, and small sample sizes affect results. Target Switch and Quiet Search randomize condition order, but their comparisons are still demonstrations rather than controlled studies.

Precision Path requires a mouse or touch input. Other games use buttons that can also be activated with a keyboard; keyboard input changes the difficulty of pointing and search tasks. The eight HCI games stop when the tab becomes hidden. Target Rush instead keeps its 30-second clock running.

## How the website works

The site uses **HTML, CSS, and vanilla JavaScript**, with a small **Python 3** script to assemble the page. There is no npm installation, frontend framework, database, or application server required.

Each portfolio section is an independent HTML file. `build.py` combines those sections with `template.html` to produce `index.html`. The generated page contains the portfolio text, so reading it does not depend on JavaScript. Games, mobile-menu behavior, and optional image loading use JavaScript.

| File or folder | Purpose |
| --- | --- |
| `index.html` | Generated page served to visitors |
| `template.html` | Metadata, navigation, footer, CSS links, and script tags |
| `build.py` | Section order and page assembly |
| `sections/` | Editable home, about, research, experience, academics, achievements, games, and contact sections |
| `assets/styles.css` | Portfolio layout, typography, colors, and responsive styles |
| `assets/main.js` | Navigation behavior and optional image loading |
| `assets/games.css` | Shared game dialog and puzzle styles |
| `scripts/games.js` | Game registration, launch buttons, dialog, and session cleanup |
| `scripts/puzzle-logic.js` | Puzzle move rules, solvable shuffle, and win detection |
| `scripts/puzzle-game.js` | Puzzle interface |
| `scripts/shooting-game.js` | Target Rush |
| `scripts/hci-core.js` | Shared helpers for the eight HCI games |
| `scripts/*-*.js` | Individual game modules, such as `signal-watch.js` and `quiet-search.js` |
| `images/` | Portfolio images |
| `static/` | Optional game assets, including the puzzle image |
| `.nojekyll` | Keeps the prebuilt site on the static publishing path |

## Run a local copy

You can download the repository ZIP and extract it, or clone it:

```bash
git clone https://github.com/juvenileSunny/juvenileSunny.github.io.git
cd juvenileSunny.github.io
```

Open `index.html` directly for a quick preview. To preview through a local HTTP server, run this from the folder containing `index.html`:

```bash
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). Stop the server with **Ctrl + C**. On Windows, use `py` instead of `python` if needed; on some macOS/Linux installations, use `python3`.

Python is only needed for the local server or rebuilding. The published site does not run Python.

## Make it your own

1. Replace the introduction, biography, research, experience, education, and contact details in `sections/`.
2. Update the title, description, name, navigation, and links in `template.html`.
3. Replace the portfolio images with your own. Keep filenames and paths consistent, including capitalization.
4. Adjust colors and typography in `assets/styles.css`.
5. Update this README with your own background, repository URL, and contact links.
6. Rebuild the page:

```bash
python build.py
```

Commit the generated `index.html` along with the source changes. The build runs locally; simply uploading edited section files will not change the published page.

| Change | Rebuild needed? |
| --- | --- |
| Edit a file in `sections/` | Yes |
| Edit navigation, metadata, or script tags in `template.html` | Yes |
| Change section order in `build.py` | Yes |
| Edit an existing CSS or JavaScript file | No |
| Replace an image at the same path | No |
| Edit this README | No |

Direct edits to `index.html` work, but the next build overwrites them. Prefer editing the source files and rebuilding. If you manually add a script tag to `index.html`, add it to `template.html` as well.

For an additional portfolio section, create its HTML file with a unique section ID, add its name to `ORDER` in `build.py`, add a matching navigation link in `template.html`, and rebuild.

### Images

Optional education and experience images appear when their files are available; missing images are hidden. Research and certification entries use minimal text lists. The home illustration is drawn with CSS.

The puzzle looks for `static/ironman.png`. Without that file it uses numbered tiles. To use your own picture, replace that image or update both its loading path in `scripts/puzzle-game.js` and its CSS path in `assets/games.css`. A square image gives the most predictable result.

When making your own portfolio, use your own biography and media, and check the repository's license and the permissions for any third-party assets before reuse.

## Add a game

Create `scripts/my-game.js`. Each game registers a unique ID, a title, a description, and a `mount` function. The function creates a fresh session and returns the cleanup function used when the dialog closes.

```js
PortfolioGames.register({
  id: 'click-counter',
  title: 'Click Counter',
  description: 'A minimal example of a session-based game.',

  mount(container) {
    let clicks = 0;
    const events = new AbortController();
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Clicks: 0';
    container.append(button);

    button.addEventListener('click', () => {
      clicks += 1;
      button.textContent = `Clicks: ${clicks}`;
    }, { signal: events.signal });

    return () => {
      events.abort();
      // Also clear any timers, cancel animation frames,
      // stop audio, and dispose of engine instances you create.
      container.replaceChildren();
    };
  }
});
```

Add its script tag in `template.html`, after the existing `scripts/games.js` tag:

```html
<script src="scripts/my-game.js" defer></script>
```

Run `python build.py`, then upload the new script, updated template, and generated `index.html`. The game adds its own entry to the list; no edit to `sections/games.html` is required.

**Load order matters:** `games.js` must load before any game registers. `puzzle-logic.js` must load before `puzzle-game.js`. `hci-core.js` must load before the eight HCI modules. Keep `defer` on these script tags.

Remove a game's script tag from `template.html` and rebuild to remove it from the list. Keep per-session state inside `mount`, and avoid persistent browser storage if you want every launch to start fresh.

## Publish your version on GitHub Pages

1. Put the website files in your repository root, with `index.html` at the top level. If using an extracted package, copy the **contents** of its `portfolio` folder rather than nesting that folder in the repository.
2. Include the required `assets/`, `scripts/`, and any image folders, plus `.nojekyll`. Keep the editable sources in the repository for future updates.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your publishing branch, choose **`/(root)`**, and save.
6. Check the deployment status, then open the URL shown in Pages settings.

For a personal homepage, use a repository named `YOUR-USERNAME.github.io`. Relative asset paths also support a project site under `YOUR-USERNAME.github.io/REPOSITORY/`.

This setup publishes the committed `index.html`; it does not automatically execute `build.py`. Preserve any existing configuration you still need when updating a working site. If you copy a repository with a custom domain, remove or replace the original owner's domain configuration for your own deployment.

See [GitHub's publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) for configuration details.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Section edits do not appear | Rebuild and upload the resulting `index.html` |
| A game is missing | Check its script tag, filename, upload location, and dependency order |
| All HCI games are missing | Confirm `hci-core.js` loads before those modules |
| A script or image returns 404 | Check the path, case-sensitive filename, and accidental extra `portfolio/` folder |
| The old design remains visible | Confirm deployment finished, then hard refresh with Ctrl + Shift + R |
| Styling is missing | Confirm `assets/styles.css` and `assets/games.css` are uploaded |
| A game fails to open | Check the browser's developer console for JavaScript errors |

Before publishing changes, check desktop and narrow-screen layouts, navigation links, and the games you changed. Open, close, and reopen a game to confirm that it starts fresh. Automated logic checks do not replace testing in an actual browser.

## Connect

I welcome conversations about VR usability, human–computer interaction, behavioral analytics, and interactive application development.

- **Portfolio:** [juvenilesunny.github.io](https://juvenilesunny.github.io/)
- **Email:** [msunny@ualr.edu](mailto:msunny@ualr.edu)
- **LinkedIn:** [jahed-murad-sunny](https://www.linkedin.com/in/jahed-murad-sunny/)
- **GitHub:** [juvenileSunny](https://github.com/juvenileSunny)
