/* Video Speaker Studio public trial guide. Runs entirely in the browser. */
(() => {
  "use strict";
  const known = ["diarization", "rename", "merge", "compare", "export", "subtitles"];
  const params = new URLSearchParams(window.location.search);
  const asked = (params.get("focus") || "").split(",").filter(f => known.includes(f));
  const focus = new Set(asked);
  const cards = [...document.querySelectorAll(".trial-test[data-feature]")];
  const progress = document.getElementById("testProgress");
  const showAll = document.getElementById("showAllTests");
  const featureChecks = [...document.querySelectorAll('#shareChoices input[type="checkbox"]')];
  const shareUrl = document.getElementById("shareUrl");
  const status = document.getElementById("copyStatus");

  if (focus.size > 0) {
    cards.forEach(card => { card.hidden = !focus.has(card.dataset.feature); });
    showAll.hidden = false;
    featureChecks.forEach(item => { item.checked = focus.has(item.value); });
  }
  showAll.addEventListener("click", () => {
    cards.forEach(card => { card.hidden = false; });
    showAll.hidden = true;
    refreshProgress();
  });
  function refreshProgress() {
    const shown = cards.filter(c => !c.hidden);
    const done = shown.filter(c => c.querySelector(".trial-done").checked);
    cards.forEach(card => card.classList.toggle("is-done", card.querySelector(".trial-done").checked));
    progress.textContent = `${done.length} of ${shown.length} displayed tests completed. Mark these as you finish; they are not sent anywhere.`;
  }
  cards.forEach(card => card.querySelector(".trial-done").addEventListener("change", refreshProgress));
  refreshProgress();

  const gpu = document.getElementById("gpuType");
  const vram = document.getElementById("vram");
  const advice = document.getElementById("modelAdvice");
  function refreshAdvice() {
    const n = Number(vram.value);
    if (gpu.value === "cpu") {
      advice.textContent = "CPU mode: start with Tiny, Base, or Small. Medium and Large-v3 may run with CPU int8 but can be very slow. GPU VRAM reference values do not determine CPU compatibility.";
    } else if (gpu.value !== "nvidia" || !n) {
      advice.textContent = "Start with Small using Auto GPU / CPU. Select NVIDIA and your dedicated GPU VRAM for a hardware-based suggestion. A browser cannot reliably detect GPU memory.";
    } else if (n < 2) {
      advice.textContent = `${n} GB NVIDIA GPU: try Tiny or Base first; Small may be tight. CPU mode is an alternative. Real requirements depend on drivers, other running programs and precision.`;
    } else if (n < 5) {
      advice.textContent = `${n} GB NVIDIA GPU: Small is the sensible starting choice. Medium (OpenAI reference ~5 GB) may not fit at standard precision; quantized faster-whisper can use less but is not guaranteed.`;
    } else if (n < 8) {
      advice.textContent = `${n} GB NVIDIA GPU: Small and Medium are reasonable tests. Large-v3 may run with quantization but memory headroom is limited; compare results before relying on it.`;
    } else if (n < 10) {
      advice.textContent = `${n} GB NVIDIA GPU: try Small, Medium, and Large-v3. The app uses faster-whisper int8_float16 on CUDA, so Large-v3 may fit even though OpenAI's reference is ~10 GB. Not guaranteed; GPU runtime setup and free VRAM still matter.`;
    } else {
      advice.textContent = `${n} GB NVIDIA GPU: all five models in the current app are sensible candidates, including Large-v3. Start with Small to check the installation, then compare quality and speed. Actual usable VRAM can be lower.`;
    }
  }
  // Prefer a same-origin, maintainer-refreshed snapshot of OpenAI's README
  // table; keep the HTML table as a safe fallback for offline viewing.
  fetch("assets/whisper-models.json")
    .then(response => { if (!response.ok) throw new Error("reference unavailable"); return response.json(); })
    .then(source => {
      const map = new Map(source.models.map(model => [model.name, model.vram_gb]));
      const rows = [...document.querySelectorAll(".trial-model-table tbody tr")];
      for (const row of rows) {
        const key = row.cells[0].textContent.startsWith("Large") ? "large" : row.cells[0].textContent.trim().toLowerCase();
        const memory = map.get(key);
        if (typeof memory === "number") row.cells[1].textContent = `~${memory} GB`;
      }
      document.getElementById("modelSourceStatus").textContent = "Reference values loaded from a locally cached snapshot of the official OpenAI Whisper table.";
    })
    .catch(() => { /* Static table is still accurate and useful offline. */ });
  gpu.addEventListener("change", refreshAdvice);
  vram.addEventListener("change", refreshAdvice);
  refreshAdvice();

  function selectedFeatures() {
    return featureChecks.filter(el => el.checked).map(el => el.value);
  }
  function buildShareUrl() {
    const link = new URL(window.location.href);
    link.hash = "";
    link.search = "";
    const chosen = selectedFeatures();
    if (chosen.length && chosen.length !== known.length) link.searchParams.set("focus", chosen.join(","));
    return link.href;
  }
  function refreshUrl() { shareUrl.value = buildShareUrl(); }
  featureChecks.forEach(el => el.addEventListener("change", refreshUrl));
  refreshUrl();

  async function copyText(value, success) {
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = success;
    } catch {
      // Manual copy fallback works under file:// and non-secure contexts.
      shareUrl.focus(); shareUrl.select();
      status.textContent = "Clipboard access unavailable. Copy the selected link manually (Ctrl+C).";
    }
  }
  document.getElementById("copyUrl").addEventListener("click", () => copyText(shareUrl.value, "Testing link copied."));
  document.getElementById("copyInvite").addEventListener("click", () => {
    const chosen = selectedFeatures().map(f => ({diarization:"speaker detection",rename:"renaming speakers",merge:"merging transcript lines",compare:"comparing Whisper models",export:"timestamp exports",subtitles:"subtitle generation"}[f]));
    const text = `I'd appreciate your feedback on Video Speaker Studio, a local video transcription and subtitle tool I built.\n\nTesting guide: ${buildShareUrl()}\n\nIf you have time, please try ${chosen.length ? chosen.join(", ") : "any of the available tests"}. The guide includes the installation steps and Whisper model requirements. You can use a short video you have permission to process.\n\nI'd be interested in anything confusing, any inaccuracies, and your computer's GPU/VRAM and chosen model (if you're comfortable sharing those details). Thank you!`;
    copyText(text, "Invitation copied. Paste it into your email or message.");
  });
  document.getElementById("copyFeedback").addEventListener("click", () => {
    const feedback = cards.filter(c => !c.hidden).map(c => {
      const done = c.querySelector(".trial-done").checked ? "x" : " ";
      return `[${done}] ${c.querySelector("strong").textContent}`;
    }).join("\n");
    copyText(`Video Speaker Studio testing notes\n${window.location.href}\n\n${feedback}\n\nWhisper model(s) tested:\nHardware / GPU VRAM (optional):\nWhat worked:\nWhat was confusing or incorrect:\nSuggestions:\n`, "Feedback template copied.");
  });
})();
