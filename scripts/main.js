// scripts/main.js
console.log("✅ All scripts loaded successfully!");

document.addEventListener("DOMContentLoaded", () => {
  const main = document.getElementById("content");
  const navLinks = document.querySelectorAll("nav a");

  async function loadSection(sectionName) {
    if (sectionName === "home") {
      document.getElementById("home").scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      const res = await fetch(`sections/${sectionName}.html`);
      if (!res.ok) throw new Error(`Section ${sectionName} not found`);
      const html = await res.text();
      main.innerHTML = html;

      // scroll to top smoothly after loading new content
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      main.innerHTML = `<p style="color:red; text-align:center;">Error loading ${sectionName}</p>`;
    }
  }

  // Handle navbar clicks
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        const sectionName = href.substring(1); // remove '#'
        loadSection(sectionName);
      }
    });
  });
});
