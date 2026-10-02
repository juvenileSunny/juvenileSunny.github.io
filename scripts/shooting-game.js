/* Target Rush: a self-contained game module for PortfolioGames.
   Add this script AFTER scripts/games.js. No extra assets or saved state. */
PortfolioGames.register({
  id: 'target-rush',
  title: 'Target Rush',
  description: 'A 30-second shooting gallery. Hit the targets before they disappear.',
  mount(container) {
    const events = new AbortController();
    let running = false, disposed = false, timer = null;
    let deadline = 0, targetDeadline = 0, hits = 0, shots = 0, escaped = 0;
    const duration = 30000;
    container.innerHTML = `
      <style>
        .tr-game{font-family:inherit}
        .tr-game .tr-help{font-size:13px;line-height:1.7;margin:18px 0}
        .tr-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:18px 0}
        .tr-stat{border-bottom:1px solid var(--line,#ccd4cc);padding-bottom:8px;font-size:10px;text-transform:uppercase;letter-spacing:1px}
        .tr-stat strong{display:block;font-size:24px;line-height:1.4;letter-spacing:0;color:var(--ink,#193831)}
        .tr-arena{position:relative;height:300px;max-height:45svh;min-height:200px;border-radius:8px;overflow:hidden;cursor:crosshair;touch-action:manipulation;background-color:#142e29;background-image:linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px);background-size:25px 25px}
        .tr-field{position:absolute;inset:38px;pointer-events:none}
        .tr-target{pointer-events:auto;position:absolute;width:60px;height:60px;padding:0;transform:translate(-50%,-50%);border:0;border-radius:50%;cursor:crosshair;background:radial-gradient(circle,#ffe5a0 0 16%,#bc472d 17% 34%,#fff2d0 35% 53%,#bc472d 54% 72%,#ffe5a0 73%);box-shadow:0 3px 15px #0008;touch-action:manipulation}
        .tr-target:focus-visible{outline:3px solid white;outline-offset:5px}
        .tr-overlay{position:absolute;inset:0;display:grid;place-content:center;text-align:center;color:#e4edb3;pointer-events:none;font-size:14px;padding:25px}
        .tr-overlay strong{font-family:Georgia,serif;font-size:36px;font-weight:400;display:block;margin-bottom:8px}
        .tr-actions{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:18px}
        .tr-start{background:var(--ink,#193831);color:var(--paper,#f5f4ef);border:0;border-radius:25px;padding:11px 22px;font:inherit;font-size:13px;cursor:pointer}
        .tr-game .tr-status{font-size:13px;min-height:3em;margin:14px 0 0}
        .tr-game .tr-note{font-size:11px;color:var(--muted,#58685f);margin:8px 0 0}
        .tr-game [hidden]{display:none!important}
      </style>
      <div class="tr-game">
        <p class="tr-help">Click or tap the bullseye before it moves. Each hit earns 10 points. Targets get faster as you score. Keyboard: Tab to the target, then press Enter or Space to shoot.</p>
        <div class="tr-stats">
          <div class="tr-stat">Score<strong data-score>0</strong></div>
          <div class="tr-stat">Time<strong data-time>30s</strong></div>
          <div class="tr-stat">Accuracy<strong data-accuracy>—</strong></div>
        </div>
        <div class="tr-arena" aria-label="Target shooting arena">
          <div class="tr-field"><button class="tr-target" type="button" aria-label="Shoot target" hidden></button></div>
          <div class="tr-overlay"><strong>Ready, aim…</strong><span>Start a round when you’re ready.</span></div>
        </div>
        <div class="tr-actions"><button class="tr-start" type="button">Start round</button><span class="tr-note">30 seconds · +10 per hit</span></div>
        <p class="tr-status" role="status" aria-live="polite">Aim for accuracy, then build your speed.</p>
        <p class="tr-note">Closing ends the session. No scores are saved.</p>
      </div>`;
    const get = selector => container.querySelector(selector);
    const arena = get('.tr-arena'), target = get('.tr-target'), overlay = get('.tr-overlay');
    const startButton = get('.tr-start'), status = get('.tr-status');
    const score = get('[data-score]'), time = get('[data-time]'), accuracy = get('[data-accuracy]');
    function update(now) {
      score.textContent = String(hits * 10);
      time.textContent = Math.max(0, Math.ceil((deadline - now) / 1000)) + 's';
      accuracy.textContent = shots ? Math.round(hits / shots * 100) + '%' : '—';
    }
    function spawn(now) {
      target.style.left = (Math.random() * 100) + '%';
      target.style.top = (Math.random() * 100) + '%';
      target.hidden = false;
      targetDeadline = now + Math.max(650, 1700 - hits * 35);
    }
    function stop() {
      running = false;
      clearInterval(timer); timer = null;
      target.hidden = true;
      time.textContent = '0s';
      overlay.innerHTML = '<strong>Round complete</strong><span>Try another round to beat your score.</span>';
      overlay.hidden = false;
      startButton.textContent = 'Play again';
      status.textContent = `Final score: ${hits * 10}. ${hits} hits from ${shots} shots. Accuracy: ${shots ? Math.round(hits / shots * 100) : 0}%. Targets escaped: ${escaped}.`;
      startButton.focus();
    }
    function tick() {
      if (!running || disposed) return;
      const now = performance.now();
      if (now >= deadline) { stop(); return; }
      if (now >= targetDeadline) { escaped++; spawn(now); }
      update(now);
    }
    startButton.addEventListener('click', () => {
      clearInterval(timer);
      hits = shots = escaped = 0;
      running = true;
      const now = performance.now();
      deadline = now + duration;
      overlay.hidden = true;
      startButton.textContent = 'Restart round';
      status.textContent = 'Round started. Hit the bullseyes!';
      spawn(now); update(now);
      timer = setInterval(tick, 50);
      target.focus({preventScroll: true});
    }, {signal: events.signal});
    arena.addEventListener('click', event => {
      if (!running || disposed) return;
      const now = performance.now();
      if (now >= deadline) { stop(); return; }
      // Check expiry at input time as well as on the timer.
      const expired = now >= targetDeadline;
      shots++;
      if (event.target === target && !expired) { hits++; spawn(now); }
      else if (expired) { escaped++; spawn(now); }
      update(now);
    }, {signal: events.signal});
    // The 30-second clock continues if the player switches tabs.
    document.addEventListener('visibilitychange', tick, {signal: events.signal});
    return () => {
      disposed = true; running = false;
      clearInterval(timer);
      events.abort();
      container.replaceChildren();
    };
  }
});
