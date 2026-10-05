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

  const renderSearchResults = (target, list) => {
    if (!target) return;
    target.innerHTML = "";

    if (!list.length) {
      target.innerHTML = "<p style='grid-column:1/-1;text-align:center;color:var(--muted);margin:50px'>No releases found.</p>";
      return;
    }

    list.forEach(app => {
      target.appendChild(card(app, app.category === "tutorials"));
    });
  };

  const normalizeSearch = (value) => String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const searchScore = (app, query) => {
    const name = normalizeSearch(app.name);
    const slug = normalizeSearch(app.slug);
    let value = 0;
    if (name === query) value += 1000;
    if (slug === query) value += 900;
    if (name.startsWith(query)) value += 500;
    if (slug.startsWith(query)) value += 400;
    if (name.includes(query)) value += 200;
    if (slug.includes(query)) value += 150;
    return value;
  };

  const searchMatches = (query, source = state.apps) => {
    const q = normalizeSearch(query);
    if (!q) return source.slice();

    const terms = q.split(" ").filter(Boolean);
    return source
      .filter(app => {
        const nameAndSlug = normalizeSearch([app.name, app.slug].join(" "));
        return terms.every(term => nameAndSlug.includes(term));
      })
      .sort((a, b) =>
        searchScore(b, q) - searchScore(a, q) ||
        String(a.name || "").localeCompare(String(b.name || ""))
      );
  };

  const renderGroupedSearch = (target, list) => {
    if (!target) return;
    target.innerHTML = "";

    if (!list.length) {
      target.innerHTML = "<p style='grid-column:1/-1;text-align:center;color:var(--muted);margin:50px'>No releases found.</p>";
      return;
    }

    const groups = [
      ["apps", "📱 App Mods"],
      ["games", "🎮 Game Mods"],
      ["tutorials", "🔧 Modding Tutorials"]
    ];

    let shownGroups = 0;
    for (const [category, title] of groups) {
      const items = list
        .filter(app => String(app.category || "") === category)
        .sort((a,b) =>
          searchScore(b, state.query) - searchScore(a, state.query) ||
          String(a.name || "").localeCompare(String(b.name || ""))
        );
      if (!items.length) continue;

      const heading = document.createElement("div");
      heading.style.cssText = "grid-column:1/-1;margin:20px 0 2px;text-align:center;color:var(--neon);font-size:24px;font-weight:800;";
      heading.textContent = title;
      target.appendChild(heading);

      const wrap = document.createElement("div");
      wrap.style.cssText = "grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;";
      items.forEach(app => wrap.appendChild(card(app, category === "tutorials")));
      target.appendChild(wrap);
      shownGroups++;
    }

    if (!shownGroups) {
      list.forEach(app => target.appendChild(card(app, app.category === "tutorials")));
    }
  };

  const homeRender = () => {
    const grid = $("appsContainer");
    const dashboard = $("catalogDashboard");
    const legacySearch = $("legacySearchArea");
    if (!grid || !dashboard) return;

    const dashboardSections = dashboard.querySelectorAll(".tgm-catalog-section, .tgm-category-section");

    if (state.query) {
      const query = normalizeSearch(state.query);
      const list = searchMatches(query, state.apps);
      state.query = query;

      dashboard.style.display = "block";
      dashboardSections.forEach(section => {
        section.style.display = "none";
      });
      if (legacySearch) legacySearch.style.display = "block";
      const filters = $("filtersSection");
      if (filters) filters.style.display = "none";
      renderGroupedSearch(grid, list);
      return;
    }

    dashboard.style.display = "block";
    dashboardSections.forEach(section => {
      section.style.display = "";
    });
    if (legacySearch) legacySearch.style.display = "none";

    if (window.TGMHomeSections?.render) {
      window.TGMHomeSections.render(state.apps);
    }

    const list = state.apps.filter(app => app.category === state.category);
    render(grid, list, state.category === "tutorials");

    const trendingSection = $("trendingSection");
    if (trendingSection) trendingSection.style.display = "";

    document.querySelectorAll(".filter-btn").forEach(item =>
      item.classList.toggle("active", item.dataset.category === state.category)
    );
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
        state.searchResults = null;

        if (!state.query) {
          state.category = "apps";
          const filters = $("filtersSection");
          if (filters) filters.style.display = "flex";
          homeRender();
          return;
        }

        // Search the full local live catalog on every keystroke.
        // Matching is based on the literal typed substring(s) in app name/slug.
        homeRender();
      });
    }

    const topInput = $("topSearchInput");
    const topBtn = $("topSearchBtn");

    if (topInput && !topInput.dataset.liveCatalogBound) {
      topInput.dataset.liveCatalogBound = "1";
      topInput.addEventListener("input", () => {
        if (input) {
          input.value = topInput.value;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
      if (input) {
        input.addEventListener("input", () => {
          if (topInput.value !== input.value) topInput.value = input.value;
        });
      }
    }

    if (topBtn && !topBtn.dataset.liveCatalogBound) {
      topBtn.dataset.liveCatalogBound = "1";
      topBtn.addEventListener("click", () => {
        if (input) {
          input.value = topInput ? topInput.value : "";
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    }

    document.querySelectorAll(".top-nav-link").forEach(item => {
      if (item.dataset.liveCatalogBound) return;
      item.dataset.liveCatalogBound = "1";
      item.addEventListener("click", event => {
        event.preventDefault();
        if (item.classList.contains("home")) {
          state.category = "apps";
          state.query = "";
          state.searchResults = null;
          if (input) input.value = "";
          if (topInput) topInput.value = "";
          showPage("homePage");
          homeRender();
          requestAnimationFrame(() => {
            const trending = $("trendingSection");
            const top = trending
              ? Math.max(0, trending.getBoundingClientRect().top + window.scrollY - 8)
              : 0;
            window.scrollTo({ top, left: 0, behavior: "smooth" });
          });
        } else if (item.dataset.category) {
          state.query = "";
          state.searchResults = null;
          if (input) input.value = "";
          if (topInput) topInput.value = "";
          categoryRender(item.dataset.category);
        } else if (item.classList.contains("blog")) {
          showPage("blogPage");
        }
      });
    });

    const searchBtn = $("searchBtn");
    if (searchBtn && !searchBtn.dataset.liveCatalogBound) {
      searchBtn.dataset.liveCatalogBound = "1";
      searchBtn.addEventListener("click", () => {
        state.query = input ? input.value.trim() : "";
        state.searchResults = null;

        if (!state.query) {
          state.category = "apps";
        }

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

        if (item.dataset.homeSection) {
          const homePage = $("homePage");
          if (homePage) showPage("homePage");
          const section = $(item.dataset.homeSection);
          if (section) {
            requestAnimationFrame(() => {
              const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - 10);
              window.scrollTo({ top, left: 0, behavior: "smooth" });
            });
          }
        } else if (item.classList.contains("home")) {
          state.category = "apps";
          state.query = "";
          state.searchResults = null;
          if (input) input.value = "";

          const filters = $("filtersSection");
          if (filters) filters.style.display = "flex";

          // Explicitly restore the Home page so Home works even when the
          // current view was created by live search.
          showPage("homePage");
          homeRender();

          const returnToTrending = () => {
            showPage("homePage");

            const trending = $("trendingSection");
            if (trending) {
              trending.style.display = "block";
              const top = Math.max(
                0,
                trending.getBoundingClientRect().top + window.scrollY - 8
              );
              window.scrollTo({ top, left: 0, behavior: "smooth" });
            } else {
              window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            }
          };

          // Wait until the Home render has restored the Trending section.
          requestAnimationFrame(() => {
            requestAnimationFrame(returnToTrending);
          });
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

  };

  const setup = async () => {
    const grid = $("appsContainer");
    if (grid) {
      grid.innerHTML =
        "<p style='grid-column:1/-1;text-align:center;color:var(--muted);margin:50px'>Loading live catalog…</p>";
    }

    setupNavigation();

    try {
      // data.js already boots the lightweight live catalog. Reuse that single
      // request instead of issuing a second /api/apps request on page load.
      if (window.TGM_LIVE_READY) {
        await window.TGM_LIVE_READY;
      }

      let source = Array.isArray(window.apps) ? window.apps : [];

      // Primary path: reuse the single catalog request started by data.js.
      // Fallback: if that global cache is empty, make exactly one catalog
      // request here. This keeps the homepage alive without returning to the
      // old per-app hydration behavior.
      if (!source.length) {
        try {
          const response = await window.TGMApi.listApps({ limit: 100 });
          const rows = Array.isArray(response.apps) ? response.apps : [];
          source = rows.map(window.TGMApi.normalizeListApp);
          if (Array.isArray(window.apps)) {
            window.apps.splice(0, window.apps.length, ...source);
          }
        } catch (fallbackError) {
          console.warn("Live catalog fallback failed:", fallbackError);
        }
      }

      state.apps = source.slice();

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

      // If data.js populated apps despite another transient failure, render
      // that cache rather than replacing the homepage with an error message.
      const source = Array.isArray(window.apps) ? window.apps : [];
      state.apps = source.slice();

      if (state.apps.length) {
        showPage("homePage");
        homeRender();
        return;
      }

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
