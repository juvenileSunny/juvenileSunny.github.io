/**
 * Portfolio project gallery.
 *
 * To add a project:
 * Copy an object in PROJECTS and update its details.
 * New categories automatically appear as filter buttons.
 *
 * Requires these elements in sections/projects.html:
 * - project-filters
 * - project-count
 * - project-list
 */

(() => {
  "use strict";

  const PROJECTS = [
    {
      title: "Video Speaker Studio",
      category: "AI & Tools",
      type: "Open-source application · 2026",
      description:
        "Local video transcription and subtitle creation with automatic " +
        "speaker detection, editable speaker names, dialogue merging, " +
        "selectable time ranges, and flexible video-time and Unix " +
        "timestamp exports.",
      technologies: [
        "Python",
        "Flask",
        "Whisper",
        "FFmpeg",
        "JavaScript"
      ],
      links: [
        {
          label: "Setup & testing guide",
          url: "./try-video-speaker-studio.html"
        },
        {
          label: "View GitHub",
          url: "https://github.com/juvenileSunny/video-speaker-studio"
        }
      ]
    },
    {
      title: "Library Management System",
      category: "Desktop Applications",
      type: "Academic Project",
      description:
        "A hierarchical desktop application integrated with an SQL " +
        "database to manage library operations.",
      technologies: ["SQL", "WEB-DEV", "JS"],
      links: [
        {
          label: "View Code",
          url: "https://github.com/juvenileSunny/LibraryManagementSystem"
        }
      ]
    }
  ];

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function createProject(project) {
    const article = createElement("article", "research-item");
    const content = createElement("div", "research-content");

    content.append(
      createElement("span", "research-type", project.type),
      createElement("h3", "", project.title),
      createElement("p", "research-description", project.description)
    );

    const technologies = createElement("div", "project-tech");
    technologies.setAttribute("aria-label", "Technologies");

    for (const technology of project.technologies ?? []) {
      technologies.append(
        createElement("span", "project-tag", technology)
      );
    }

    const actions = createElement("div", "project-actions");

    for (const link of project.links ?? []) {
      let url;

      try {
        url = new URL(link.url, document.baseURI);
      } catch {
        continue;
      }

      const isWebLink = ["http:", "https:"].includes(url.protocol);
      const isLocalPreview =
        window.location.protocol === "file:" &&
        url.protocol === "file:";

      if (!isWebLink && !isLocalPreview) {
        continue;
      }

      const anchor = createElement(
        "a",
        "research-link",
        `${link.label} →`
      );

      anchor.href = url.href;

      if (isWebLink && url.origin !== window.location.origin) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }

      actions.append(anchor);
    }

    if (technologies.childElementCount > 0) {
      content.append(technologies);
    }

    if (actions.childElementCount > 0) {
      content.append(actions);
    }

    article.append(content);
    return article;
  }

  function initializeGallery() {
    const filters = document.getElementById("project-filters");
    const count = document.getElementById("project-count");
    const list = document.getElementById("project-list");

    if (!filters || !count || !list) {
      return;
    }

    // null means "All", so it cannot conflict with a category name.
    const categories = [
      null,
      ...new Set(PROJECTS.map(project => project.category))
    ];

    const filterButtons = [];

    function render(selectedCategory) {
      const visibleProjects = PROJECTS.filter(project =>
        selectedCategory === null ||
        project.category === selectedCategory
      );

      list.replaceChildren(
        ...visibleProjects.map(createProject)
      );

      for (const { button, category } of filterButtons) {
        button.setAttribute(
          "aria-pressed",
          String(category === selectedCategory)
        );
      }

      const total = visibleProjects.length;
      count.textContent =
        `${total} project${total === 1 ? "" : "s"}`;

      if (total === 0) {
        list.append(
          createElement("p", "", "No projects in this category yet.")
        );
      }
    }

    filters.replaceChildren();

    for (const category of categories) {
      const button = createElement(
        "button",
        "project-filter",
        category === null ? "All" : category
      );

      button.type = "button";
      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", () => {
        render(category);
      });

      filterButtons.push({ button, category });
      filters.append(button);
    }

    render(null);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeGallery,
      { once: true }
    );
  } else {
    initializeGallery();
  }
})();