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