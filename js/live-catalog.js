(() => {
  if (!window.TGMApi) return;

  const $ = (id) => document.getElementById(id);
  const state = { apps: [], category: "apps", query: "" };

  const card = (app, tutorial = false) => {
    const el = document.createElement("div");
    el.className = tutorial ? "card tutorial-card" : "card";

    const img = document.createElement("img");
    img.src = app.image;
    img.alt = app.name;
    img.loading = "lazy";
    img.onerror = () => { img.src = "images/logo.png"; };
    el.appendChild(img);

    const h3 = document.createElement("h3");
    h3.textContent = app.name;
    el.appendChild(h3);

    const p = document.createElement("p");
    p.textContent = tutorial
      ? "▶ YouTube • Step-by-step guide"
      : (app.version === "—"
        ? (app.size !== "—" ? "Release • " + app.size : "Tutorial")
        : app.version + " • " + app.size);
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

  const homeRender = () => {
    const grid = $("appsContainer");
    if (!grid) return;
    let list = state.apps.filter(app => state.query ? true : app.category === state.category);
    if (state.query) {
      const q = state.query.toLowerCase();
      list = state.apps.filter(app =>
        [app.name, app.publisher, app.genre, app.description].join(" ").toLowerCase().includes(q)
      );
    }
    render(grid, list, list.every(app => app.category === "tutorials"));
    const trending = $("trendingSection");
    const filters = $("filtersSection");
    if (state.query) {
      if (trending) trending.style.display = "none";
      if (filters) filters.style.display = "none";
    } else {
      if (trending) trending.style.display = "block";
      if (filters) filters.style.display = "flex";
    }
  };

  const categoryRender = (category) => {
    state.category = category;
    const title = $("categoryTitle");
    if (title) {
      title.textContent = ({apps:"App Mods",games:"Game Mods",tutorials:"Modding Tutorials"})[category] || "Catalog";
    }
    const grid = $("categoryGrid");
    const list = state.apps.filter(app => app.category === category);
    render(grid, list, category === "tutorials");

    const home = $("homePage"), categoryPage = $("categoryPage");
    const blog = $("blogPage"), faq = $("faqPage");
    if (home) home.style.display = "none";
    if (categoryPage) categoryPage.style.display = "block";
    if (blog) blog.style.display = "none";
    if (faq) faq.style.display = "none";
  };

  const setup = async () => {
    try {
      const data = await window.TGMApi.listApps({ limit: 100 });
      const legacyApps = (typeof apps !== "undefined" && Array.isArray(apps)) ? apps.slice() : [];
      const liveApps = (data.apps || []).map(window.TGMApi.normalizeListApp);

      // Keep the original catalog visible. Published live records replace their
      // matching legacy entries, while apps that have not been migrated yet
      // remain available for browsing until their release is uploaded/published.
      // Match migrated live records to legacy records by slug/id first,
      // then by normalized name + category. Legacy tutorial IDs such as
      // "tut-lucky-patcher" may differ from the live CMS slug, so matching
      // by ID alone can render the same tutorial twice.
      const key = (app) => [
        String(app.category || "").trim().toLowerCase(),
        String(app.name || "").trim().toLowerCase()
      ].join("::");

      const liveById = new Map(liveApps.flatMap(app => [
        [app.slug || app.id, app],
        [app.id, app]
      ]));
      const liveByKey = new Map(liveApps.map(app => [key(app), app]));
      const merged = legacyApps.map(legacy =>
        liveById.get(legacy.id) || liveByKey.get(key(legacy)) || legacy
      );

      const usedKeys = new Set(merged.map(key));
      liveApps.forEach(app => {
        const sameId = legacyApps.some(legacy =>
          legacy.id === app.id || legacy.id === app.slug
        );
        const sameKey = usedKeys.has(key(app));
        if (!sameId && !sameKey) {
          merged.push(app);
          usedKeys.add(key(app));
        }
      });

      state.apps = merged;
      if (!state.apps.length) return;

      homeRender();

      const input = $("searchInput");
      if (input) {
        input.addEventListener("input", () => {
          state.query = input.value.trim();
          homeRender();
        });
      }

      document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          state.query = "";
          if (input) input.value = "";
          state.category = btn.dataset.category || "apps";
          homeRender();
        });
      });

      document.querySelectorAll(".sidebar-item").forEach(item => {
        const category = item.dataset.category;
        if (category) {
          item.addEventListener("click", () => setTimeout(() => categoryRender(category), 0));
        }
      });
    } catch (error) {
      console.warn("Live catalog unavailable:", error);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
