// scripts/header-effects.js
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (header) header.classList.toggle("scrolled", window.scrollY > 50);
});
