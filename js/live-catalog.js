(() => {
  if (!window.TGMApi) return;

  const $ = (id) => document.getElementById(id);
  const state = { apps: [], category: "apps", query: "" };

  const card = (app, tutorial = false) => {
    const el = document.createElement("div");
    el.className = tutorial ? "card tutorial-card" : "card";

    const img = document.createElement("img");
    img.src = app.image || window.TGMApi.imageUrl(app.icon_url);
    img.alt = app.name || "Release";
    img.loading = "lazy";
    img.onerror = () => { img.src = "images/logo.png"; };
    el.appendChild(img);

    const h3 = document.createElement("h3");
    h3.textContent = app.name || "Untitled release";
    el.appendChild(h3);

    const p = document.createElement("p");
    p.textContent = tutorial
      ? "▶ YouTube • Step-by-step guide"
      : ((app.version && app.version !== "—") ? app.version + " • " + (app.size || "Release") : "Release");
    el.appendChild(p);

    const a = document.createElement("a");
    a.href = "app.html?id=" + encodeURIComponent(app.slug || app.id);
    a.textContent = tutorial ? "Watch Tutorial" : "View Mod";
    el.appendChild(a);

    return el;
  };

  const render = (target, list, tutorial = false) => {
    if (!target) return;
    target.innerHTML = "";

    if (!list.length) {
      target.innerHTML = "<p style='grid-column:1/-1;text-align:center;color:var(--muted);margin:50px'>No releases found.</p>";
      return;
    }

    list.forEach(app => target.appendChild(card(app, tutorial)));
  };

  const titleFor = (slug) =>
    ({ apps: "App Mods", games: "Game Mods", tutorials: "Modding Tutorials" })[slug] || "Catalog";

  const showPage = (name) => {
    ["homePage", "categoryPage", "blogPage", "faqPage"].forEach(id => {
      const el = $(id);
      if (el) el.style.display = id === name ? "block" : "none";
    });
  };

  const renderTrending = () => {
    const target = $("trendingGrid");
    const section = $("trendingSection");
    if (!target || !section) return;

    const items = state.apps.filter(app => app.category !== "tutorials").slice(0, 4);
    target.innerHTML = "";
    items.forEach(app => target.appendChild(card(app, false)));
    section.style.display = items.length ? "block" : "none";
  };

  const homeRender = () => {
    const grid = $("appsContainer");
    if (!grid) return;

    let list;
    if (state.query) {
      const query = state.query.toLowerCase().replace(/\s+/g, " ").trim();
      const nameMatches = state.apps.filter(app => {
        const haystack = [app.name, app.slug].join(" ").toLowerCase();
        return haystack.includes(query);
      });

      // Prefer actual title/slug matches. This prevents a search for
      // "lucky patcher" from returning unrelated apps merely because the
      // phrase appears somewhere in their description, while still allowing
      // a full-catalog search when no title matches exist.
      const searchPool = nameMatches.length ? nameMatches : state.apps.filter(app =>
        [app.name, app.slug, app.publisher, app.genre, app.description, app.category_name]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );

      list = [...searchPool].sort((a, b) => {
        const score = (app) => {
          const name = String(app.name || "").toLowerCase();
          const slug = String(app.slug || "").toLowerCase();
          let value = 0;
          if (name === query) value += 1000;
          if (slug === query) value += 900;
          if (name.startsWith(query)) value += 500;
          if (slug.startsWith(query)) value += 400;
          if (name.includes(query)) value += 200;
          if (slug.includes(query)) value += 150;
          return value;
        };
        return score(b) - score(a) || String(a.name || "").localeCompare(String(b.name || ""));
      });
    } else {
      list = state.apps.filter(app => app.category === state.category);
    }

    render(grid, list, !state.query && state.category === "tutorials");
    renderTrending();
    const filters = $("filtersSection");
    if (filters) filters.style.display = "flex";
  };

  const categoryRender = (category) => {
    state.category = category;
    const title = $("categoryTitle");
    if (title) title.textContent = titleFor(category);

    const grid = $("categoryGrid");
    const list = state.apps.filter(app => app.category === category);
    render(grid, list, category === "tutorials");
    showPage("categoryPage");
  };

  const setupNavigation = () => {
    const input = $("searchInput");

    if (input && !input.dataset.liveCatalogBound) {
      input.dataset.liveCatalogBound = "1";
      input.addEventListener("input", () => {
        state.query = input.value.trim();
        homeRender();
      });
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
      if (btn.dataset.liveCatalogBound) return;
      btn.dataset.liveCatalogBound = "1";
      btn.addEventListener("click", () => {
        state.query = "";
        if (input) input.value = "";
        state.category = btn.dataset.category || "apps";
        document.querySelectorAll(".filter-btn")
          .forEach(item => item.classList.toggle("active", item === btn));
        showPage("homePage");
        homeRender();
      });
    });

    document.querySelectorAll(".sidebar-item").forEach(item => {
      if (item.dataset.liveCatalogBound) return;
      item.dataset.liveCatalogBound = "1";
      item.addEventListener("click", event => {
        event.preventDefault();

        if (item.classList.contains("home")) {
          state.category = "apps";
          state.query = "";
          if (input) input.value = "";
          showPage("homePage");
          homeRender();
        } else if (item.dataset.category) {
          categoryRender(item.dataset.category);
        } else if (item.classList.contains("blog")) {
          showPage("blogPage");
        } else if (item.classList.contains("faq")) {
          showPage("faqPage");
        }

        const sidebar = $("sidebar");
        const overlay = $("overlay");
        if (sidebar) sidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("open");
      });
    });

    const menuToggle = $("menuToggle");
    const sidebar = $("sidebar");
    const overlay = $("overlay");

    if (menuToggle && sidebar && overlay && !menuToggle.dataset.drawerBound) {
      menuToggle.dataset.drawerBound = "1";
      menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("open");
      });
      overlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("open");
      });
    }
  };

  const setup = async () => {
    const grid = $("appsContainer");
    if (grid) {
      grid.innerHTML =
        "<p style='grid-column:1/-1;text-align:center;color:var(--muted);margin:50px'>Loading live catalog…</p>";
    }

    try {
      const data = await window.TGMApi.listApps({ limit: 100 });
      state.apps = (data.apps || []).map(window.TGMApi.normalizeListApp);
      setupNavigation();

      if (state.apps.length) {
        const hash = window.location.hash.replace(/^#/, "");
        if (["apps","games","tutorials"].includes(hash)) {
          categoryRender(hash);
        } else if (hash === "blog") {
          showPage("blogPage");
        } else if (hash === "faq") {
          showPage("faqPage");
        } else {
          showPage("homePage");
          homeRender();
        }
      } else {
        render(grid, []);
      }
    } catch (error) {
      console.warn("Live catalog unavailable:", error);
      if (grid) {
        grid.innerHTML =
          "<p style='grid-column:1/-1;text-align:center;color:var(--warn);margin:50px'>The live catalog could not be loaded. Please refresh the page.</p>";
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
