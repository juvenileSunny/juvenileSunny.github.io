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


## Games: fresh sessions, modular scripts

The new `sections/games.html` section hosts browser games in a shared native dialog. Escape, Close, or clicking outside ends a session and returns focus to Play. No progress is saved in cookies or browser storage. Games require JavaScript.

Upload `scripts/` and `assets/games.css` together with the rebuilt `index.html`. Keep your existing image at `static/ironman.png` to show the picture puzzle. It is not included in this package. Without it, the numbered puzzle remains playable. Images are cropped into a square tile layout.

- `scripts/games.js`: game registry, list, dialog, and session cleanup.
- `scripts/puzzle-logic.js`: legal moves, solvable shuffle, and exact goal check.
- `scripts/puzzle-game.js`: puzzle UI, keyboard/touch interaction, and optional image.
- `assets/games.css`: shared game window and puzzle styles.

### Add another game

1. Create `scripts/my-game.js` using the pattern below.
2. Add `<script src="scripts/my-game.js" defer></script>` after `scripts/games.js` in `template.html`.
3. Run `python build.py` and upload the rebuilt page and your new script. Its Play entry appears automatically.

```js
PortfolioGames.register({
  id: 'my-game', // unique identifier
  title: 'My Game',
  description: 'A short description.',
  mount(container) {
    // Create fresh state here on every launch.
    const events = new AbortController();
    container.innerHTML = '<button type="button">Start</button>';
    container.querySelector('button').addEventListener('click', () => {
      // Your gameplay code.
    }, {signal: events.signal});
    return () => {
      events.abort();
      // Cancel your timers and animation frames, stop audio,
      // and dispose of any game-engine instance here.
      container.replaceChildren();
    };
  }
});
```

For a Unity/WebGL or other engine game, mount its player inside the container and shut down its runtime in the cleanup function. Its exported files must also be uploaded. Keep all per-session state inside `mount`; do not write to persistent browser storage if you want fresh sessions only.
# Example - Add Target Rush to your portfolio

This add-on uses the existing Games section and modal from the puzzle update. It does not replace your portfolio or puzzle files.

1. Copy `scripts/shooting-game.js` into the existing `scripts` folder in your repository.
2. Open `index.html`. Find this line near the top:

```html
<script src="scripts/puzzle-game.js" defer></script>
```

Add this line directly below it:

```html
<script src="scripts/shooting-game.js" defer></script>
```

3. Add the same line to `template.html`, below the puzzle script, so a future build keeps the game.
4. Commit and upload `scripts/shooting-game.js`, `index.html`, and `template.html`. Refresh the published page after deployment.

No CSS, images, or edits to `sections/games.html` are needed. The script registers its own entry and includes its own scoped styles. The existing `scripts/games.js` must load before it.

You do not need to run `build.py` if you manually edit both HTML files above. Alternatively, edit only `template.html`, run `python build.py`, and upload the generated `index.html` too.

## Play

Choose Games → Target Rush → Play, then Start round. Hit targets with a mouse or touch. Keyboard players can Tab to the target and activate it with Enter or Space. Each hit earns 10 points. The round ends after 30 seconds, even if the tab is in the background. Restart round resets the score and clock. Closing the modal removes all game listeners and timers. Reopening starts fresh.

## Customize

In `scripts/shooting-game.js`, `duration = 30000` controls the round length in milliseconds. Update the displayed instructions if you change it. `Math.max(650, 1700 - hits * 35)` controls target lifetime: the initial lifetime is 1700 ms, decreasing by 35 ms per hit, with a 650 ms minimum.

Keyboard activation deliberately keeps focus on the target after it moves, making this an accessible alternative to pointer aiming rather than an equivalent difficulty mode. Scores are local to the round; there is no leaderboard or storage.

# Eight modular HCI games

Copy the nine JavaScript files from scripts/ into your existing scripts/ folder. Keep games.js, both puzzle scripts, and shooting-game.js.

Add the following block in BOTH index.html and template.html, inside <head>, after the existing puzzle/shooting scripts. The existing scripts/games.js must be above this block. Include hci-core.js before the eight games.

```html
<script src="scripts/hci-core.js" defer></script>
<script src="scripts/signal-watch.js" defer></script>
<script src="scripts/precision-path.js" defer></script>
<script src="scripts/target-switch.js" defer></script>
<script src="scripts/change-detective.js" defer></script>
<script src="scripts/stop-signal.js" defer></script>
<script src="scripts/rule-switch.js" defer></script>
<script src="scripts/quiet-search.js" defer></script>
<script src="scripts/rhythm-tracker.js" defer></script>
```

Upload the new scripts and the two edited HTML files. No CSS changes, dependencies, image assets, server, or edits to sections/games.html are needed. Each game registers its own list entry and uses the existing modal. No build command is required if both HTML files are edited. Alternatively, edit template.html and run python build.py to regenerate index.html.

To remove a game, remove its script tag from both HTML files. Each game lives in its own script, so you can edit or add games independently. hci-core.js manages styles, timeouts, events, restart, and disposal. All state is session-only. Hidden tabs end active sessions rather than contaminating timed results.

## Included games

| Game | Session | Results |
| --- | --- | --- |
| Signal Watch | 20 symbols, 7 targets | Hits, misses, false responses, correct response time |
| Precision Path | Wide, narrow, curved tracing paths | Time, boundary crossings, distance per round |
| Target Switch | 12 small and 12 large targets | Mean time per hit and missed clicks by condition |
| Change Detective | 5 alternating scenes, 20 seconds maximum each | Detection time, wrong guesses, timeouts |
| Stop Signal | 14 GO and 6 stop trials | GO responses, misses, successful stops, GO response time |
| Rule Switch | 20 randomly assigned color/shape rules | Errors, correct switch/repeat response times and counts |
| Quiet Search | 6 clean and 6 cluttered grids | Mean search time and errors by condition |
| Rhythm Tracker | 4 practice, 8 visible, 4 hidden beats | Absolute timing error, missed beats, extra taps |

These are interaction demos, not validated tests or evidence of improved everyday attention. Small samples, practice, condition order, screen size, and input device affect results. Target Switch and Quiet Search randomize condition order. No scores are uploaded or saved.

Precision Path requires mouse or touch. Buttons in the other games also support keyboard activation. Keyboard activation changes the nature of pointing/search tasks, so use the same pointer device for comparisons. Rhythm Tracker uses visual feedback only; no audio assets are required. Path distance is measured in fixed canvas coordinate units. Boundary crossings count entries outside a vertical corridor around the path, not time outside. The stop-signal demo uses a fixed 180 ms delay, with no estimated stop-signal reaction time.

## Quick check after upload

Hard refresh the published page. The Games section should show the puzzle, Target Rush (if previously installed), and eight new games. Open one, start, close, then reopen: it should show a fresh start screen. If none of the eight appears, check the hci-core.js path and script order. If only one is missing, check its exact filename and script tag. GitHub Pages filenames are case-sensitive.