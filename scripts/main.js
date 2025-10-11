// scripts/main.js
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href").substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
