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

  const setActiveNav = (activeKey) => {
    document.querySelectorAll(".top-nav-link").forEach(link => {
      link.classList.remove("active");
      const key = link.classList.contains("home")
        ? "home"
        : (link.dataset.category ||
          (link.dataset.page === "updates" ? "updates" :
          (link.classList.contains("blog") ? "blog" : "")));
      if (key === activeKey) link.classList.add("active");
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
    target.classList.add("tgm-search-results-grid");
    target.style.display = "grid";
    target.style.width = "100%";
    target.style.minWidth = "0";
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

      const group = document.createElement("section");
      group.className = "tgm-search-group";

      const heading = document.createElement("h3");
      heading.className = "tgm-search-group-title";
      heading.textContent = title;
      group.appendChild(heading);

      const wrap = document.createElement("div");
      wrap.className = "tgm-search-group-grid";
      items.forEach(app => wrap.appendChild(card(app, category === "tutorials")));
      group.appendChild(wrap);
      target.appendChild(group);
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
      grid.classList.remove("tgm-category-results-grid");
      setActiveNav("home");
      renderGroupedSearch(grid, list);
      return;
    }

    dashboard.style.display = "block";
    dashboardSections.forEach(section => {
      section.hidden = false;
      section.style.display = "";
    });
    if (legacySearch) legacySearch.style.display = "none";

    grid.classList.remove("tgm-search-results-grid", "tgm-category-results-grid");
    resetViewMoreStates();
    grid.style.display = "";
    grid.style.width = "";
    grid.style.maxWidth = "";
    grid.style.gridTemplateColumns = "";
    grid.style.gap = "";
    setActiveNav("home");

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
  const resetViewMoreStates = () => {
    document.querySelectorAll(".tgm-view-more").forEach(item => {
      item.classList.remove("is-current");
      item.removeAttribute("aria-disabled");
      item.tabIndex = 0;
    });
  };

  const setCurrentViewMore = (sectionId) => {
    resetViewMoreStates();
    const item = document.querySelector('.tgm-view-more[data-home-section="' + sectionId + '"]');
    if (!item) return;
    item.classList.add("is-current");
    item.setAttribute("aria-disabled", "true");
    item.tabIndex = -1;
  };

  const renderSectionPage = (sectionId) => {
    const dashboard = $("catalogDashboard");
    const legacySearch = $("legacySearchArea");
    const filters = $("filtersSection");
    if (!dashboard) return;

    state.query = "";
    state.searchResults = null;

    const input = $("searchInput");
    const topInput = $("topSearchInput");
    if (input) input.value = "";
    if (topInput) topInput.value = "";

    showPage("homePage");
    dashboard.style.display = "block";

    const sectionDomId = {
      "essential-apps": "trendingSection",
      "games-mod-latest": "games-mod-latest",
      "premium-apps-latest": "premium-apps-latest",
      "editors-choice": "editors-choice",
      "early-access": "early-access"
    }[sectionId] || sectionId;

    dashboard.querySelectorAll(".tgm-catalog-section, .tgm-category-section")
      .forEach(section => {
        const selected = section.id === sectionDomId;
        const categories = section.id === "catalog-categories";
        section.hidden = false;
        section.style.display = (selected || categories) ? "" : "none";
      });

    if (legacySearch) legacySearch.style.display = "none";
    if (filters) filters.style.display = "none";

    const grid = $("appsContainer");
    grid?.classList.remove("tgm-search-results-grid", "tgm-category-results-grid");
    setActiveNav("home");
    setCurrentViewMore(sectionId);

    if (window.TGMHomeSections?.renderSection) {
      window.TGMHomeSections.renderSection(sectionId, state.apps);
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  };

  const renderUpdatesPage = (focus = "blog") => {
    const blogSource = $("blogPage");
    const faqSource = $("faqPage");
    const dashboard = $("catalogDashboard");
    const legacySearch = $("legacySearchArea");
    const grid = $("appsContainer");
    const filters = $("filtersSection");
    if (!blogSource || !faqSource || !dashboard || !legacySearch || !grid) return;

    state.query = "";
    state.searchResults = null;
    state.category = "apps";

    const input = $("searchInput");
    const topInput = $("topSearchInput");
    if (input) input.value = "";
    if (topInput) topInput.value = "";

    showPage("homePage");
    setActiveNav("updates");

    dashboard.style.display = "block";
    dashboard.querySelectorAll(".tgm-catalog-section, .tgm-category-section")
      .forEach(section => {
        section.hidden = false;
        section.style.display = "none";
      });

    if (filters) filters.style.display = "none";
    legacySearch.style.display = "block";
    grid.classList.remove("tgm-search-results-grid", "tgm-category-results-grid");
    grid.style.display = "block";
    grid.style.width = "100%";
    grid.style.maxWidth = "100%";
    grid.style.minWidth = "0";
    grid.style.margin = "0";
    grid.innerHTML = "";

    const view = document.createElement("section");
    view.className = "tgm-updates-view";

    const addSource = (source, className) => {
      const fragment = document.createElement("div");
      fragment.className = className;
      Array.from(source.children).forEach(child => {
        if (child.tagName.toLowerCase() !== "header") {
          fragment.appendChild(child.cloneNode(true));
        }
      });
      view.appendChild(fragment);
    };

    addSource(blogSource, "tgm-update-blog");
    addSource(faqSource, "tgm-update-faq");
    grid.appendChild(view);

    // Always open Updates at the true top of the document. Some mobile
    // browsers restore the previous scroll position after the DOM swap,
    // so reset every possible scrolling root more than once.
    const resetUpdatesScroll = () => {
      const root = document.scrollingElement || document.documentElement;
      root.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    resetUpdatesScroll();
    requestAnimationFrame(() => {
      resetUpdatesScroll();
      requestAnimationFrame(resetUpdatesScroll);
    });
    setTimeout(resetUpdatesScroll, 0);
  };

  const renderStaticPage = (pageId) => {
    const source = $(pageId);
    const dashboard = $("catalogDashboard");
    const legacySearch = $("legacySearchArea");
    const grid = $("appsContainer");
    const filters = $("filtersSection");
    if (!source || !dashboard || !legacySearch || !grid) return;

    showPage("homePage");
    setActiveNav(pageId === "blogPage" ? "blog" : "faq");
    dashboard.style.display = "block";
    dashboard.querySelectorAll(".tgm-catalog-section, .tgm-category-section")
      .forEach(section => {
        section.hidden = false;
        section.style.display = "none";
      });

    filters.style.display = "none";
    legacySearch.style.display = "block";
    grid.classList.remove("tgm-search-results-grid", "tgm-category-results-grid");
    grid.style.display = "block";
    grid.style.width = "100%";
    grid.style.maxWidth = "100%";
    grid.style.minWidth = "0";
    grid.style.margin = "0";
    grid.innerHTML = "";

    const view = document.createElement("section");
    view.className = "tgm-static-view";
    Array.from(source.children).forEach(child => {
      if (child.tagName.toLowerCase() !== "header") {
        view.appendChild(child.cloneNode(true));
      }
    });
    grid.appendChild(view);

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  };

  const categoryRender = (category) => {
    state.category = category;
    state.query = "";
    state.searchResults = null;

    const input = $("searchInput");
    const topInput = $("topSearchInput");
    if (input) input.value = "";
    if (topInput) topInput.value = "";

    const dashboard = $("catalogDashboard");
    const grid = $("appsContainer");
    const legacySearch = $("legacySearchArea");
    const filters = $("filtersSection");
    const list = state.apps.filter(app => app.category === category);

    // App/Game category pages keep the same homepage header + supplied hero.
    // Only the catalog content underneath changes to the selected category.
    showPage("homePage");
    if (dashboard) {
      dashboard.style.display = "block";
      dashboard.querySelectorAll(".tgm-catalog-section, .tgm-category-section")
        .forEach(section => { section.style.display = "none"; });
    }
    if (legacySearch) legacySearch.style.display = "block";
    if (filters) filters.style.display = "none";

    if (grid) {
      grid.classList.remove("tgm-search-results-grid");
      grid.classList.add("tgm-category-results-grid");
      grid.style.display = "grid";
      grid.style.width = "100%";
      grid.style.maxWidth = "100%";
      grid.style.minWidth = "0";
      grid.style.gridTemplateColumns = window.matchMedia("(max-width:680px)").matches
        ? "repeat(2,minmax(0,1fr))"
        : "repeat(3,minmax(0,1fr))";
      grid.style.gap = "10px";
    }

    render(grid, list, category === "tutorials");
    setActiveNav(category);

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
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
          setActiveNav("home");
          homeRender();
          requestAnimationFrame(() => {
            const trending = $("trendingSection");
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          });
        } else if (item.dataset.category) {
          state.query = "";
          state.searchResults = null;
          if (input) input.value = "";
          if (topInput) topInput.value = "";
          categoryRender(item.dataset.category);
        } else if (item.dataset.page === "updates") {
          renderUpdatesPage("blog");
        } else if (item.classList.contains("blog")) {
          renderStaticPage("blogPage");
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

    document.querySelectorAll(".tgm-view-more").forEach(item => {
      if (item.dataset.liveCatalogBound) return;
      item.dataset.liveCatalogBound = "1";
      item.addEventListener("click", event => {
        if (item.classList.contains("is-current")) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        const sectionId = item.dataset.homeSection;
        if (sectionId) renderSectionPage(sectionId);
      });
    });

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
          setActiveNav("home");
          homeRender();

          requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          });
        } else if (item.dataset.category) {
          categoryRender(item.dataset.category);
        } else if (item.classList.contains("blog")) {
          renderStaticPage("blogPage");
        } else if (item.classList.contains("faq")) {
          renderStaticPage("faqPage");
        }

        if (window.TGMDrawer?.close) {
          window.TGMDrawer.close();
        } else {
          const sidebar = $("sidebar");
          const overlay = $("overlay");
          if (sidebar) sidebar.classList.remove("open");
          if (overlay) overlay.classList.remove("open");
          document.documentElement.classList.remove("tgm-drawer-open");
          document.body.classList.remove("tgm-drawer-open");
        }
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
        } else if (hash === "updates") {
          renderUpdatesPage("blog");
        } else if (hash === "blog") {
          renderStaticPage("blogPage");
        } else if (hash === "faq") {
          renderStaticPage("faqPage");
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
