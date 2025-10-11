// scripts/main.js
console.log("✅ All scripts loaded successfully!");

document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const navLinks = document.querySelectorAll("nav a");

  // Load default section (home)
  loadSection("home");

  async function loadSection(sectionName) {
    try {
      const res = await fetch(`sections/${sectionName}.html`);
      const html = await res.text();
      content.innerHTML = html;

      // Scroll to top on section change
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      content.innerHTML = `<p style="color:red;">Error loading ${sectionName} section.</p>`;
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        const sectionName = href.slice(1);
        loadSection(sectionName);
      }
    });
  });
});
