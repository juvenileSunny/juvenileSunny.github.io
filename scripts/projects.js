/**
 * Project gallery for the portfolio website.
 *
 * ADD A PROJECT: Copy one object in PROJECTS, change its fields, and commit.
 * The category filter buttons are generated automatically.
 *
 * Links to Video Speaker Studio assume the corresponding repository and
 * GitHub Pages site have been published. Update them if your repo name differs.
 */
const PROJECTS = [
  {
    title: "Video Speaker Studio",
    category: "AI & Tools",
    type: "Open-source application · 2026",
    description:
      "Local video transcription and subtitle creation with automatic speaker detection, editable speaker names, dialogue merging, selectable time ranges, and flexible video-time and Unix timestamp exports.",
    technologies: ["Python", "Flask", "Whisper", "FFmpeg", "JavaScript"],
    links: [
      { label: "Try / testing guide", url: "./try-video-speaker-studio.html?focus=rename,merge,compare" },
      { label: "GitHub", url: "https://github.com/juvenileSunny/video-speaker-studio" },
      { label: "Releases", url: "https://github.com/juvenileSunny/video-speaker-studio/releases/latest" },
      { label: "Project page", url: "https://juvenilesunny.github.io/video-speaker-studio/" }
    ]
  },
  {
    title: "Library Management System",
    category: "Software",
    type: "Desktop application",
    description:
      "Desktop software with an SQL database for managing library operations and records.",
    technologies: ["SQL", "Desktop application"],
    links: [
      { label: "GitHub", url: "https://github.com/juvenileSunny/LibraryManagementSystem" }
    ]
  }

  // Add your next project here, for example:
  // ,{
  //   title: "My Next Project",
  //   category: "XR & Games",
  //   type: "Interactive application · 2027",
  //   description: "What it does and why you built it.",
  //   technologies: ["Unity", "C#"],
  //   links: [{ label: "GitHub", url: "https://github.com/USERNAME/REPO" }]
  // }
];

(function initializeProjectGallery() {
  const list = document.getElementById("projects-list");
  const filters = document.getElementById("project-filters");
  if (!list || !filters) return;

  const categories = ["All", ...new Set(PROJECTS.map((project) => project.category))];
  let activeCategory = "All";

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderProjects() {
    list.replaceChildren();
    const visible = PROJECTS.filter((item) => activeCategory === "All" || item.category === activeCategory);

    if (!visible.length) {
      list.appendChild(createElement("p", "project-empty", "No projects in this category yet."));
      return;
    }

    for (const project of visible) {
      // Reuse existing research classes so the new section matches the site.
      const card = createElement("article", "research-item project-item");
      const content = createElement("div", "research-content");
      content.appendChild(createElement("span", "research-type", project.type));
      content.appendChild(createElement("h3", "", project.title));
      content.appendChild(createElement("p", "research-description", project.description));

      const tech = createElement("div", "project-tech");
      tech.setAttribute("aria-label", "Technologies used");
      for (const item of project.technologies || []) {
        tech.appendChild(createElement("span", "project-tag", item));
      }
      content.appendChild(tech);

      const actions = createElement("div", "project-actions");
      for (const link of project.links || []) {
        // Allow trusted HTTPS links and same-site relative guide pages.
        const targetUrl = new URL(link.url, document.baseURI);
        if (targetUrl.protocol !== "https:" && targetUrl.origin !== window.location.origin) continue;
        const anchor = createElement("a", "research-link", link.label + " ↗");
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        actions.appendChild(anchor);
      }
      content.appendChild(actions);
      card.appendChild(content);
      list.appendChild(card);
    }
  }

  function renderFilters() {
    filters.replaceChildren();
    for (const category of categories) {
      const button = createElement("button", "project-filter", category);
      button.type = "button";
      button.setAttribute("aria-pressed", String(activeCategory === category));
      button.addEventListener("click", () => {
        activeCategory = category;
        renderFilters();
        renderProjects();
      });
      filters.appendChild(button);
    }
  }

  renderFilters();
  renderProjects();
})();
