(() => {
  if (window.TGMHomeSections) return;

  const esc = (value) => String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

  const norm = (value) => String(value || "").toLowerCase().trim();

  const byUpdated = (a,b) => String(b.updated || "").localeCompare(String(a.updated || ""));

  const card = (app) => {
    const name = app.name || "Untitled";
    const version = app.version && app.version !== "—" ? app.version : "Release";
    const size = app.size && app.size !== "—" ? " • " + app.size : "";
    const image = app.image || app.icon_url || "images/logo.png";
    const id = encodeURIComponent(app.slug || app.id || "");
    return `
      <article class="hub-card">
        <img src="${esc(image)}" alt="${esc(name)}" loading="lazy" onerror="this.src='images/logo.png'">
        <div>
          <h3>${esc(name)}</h3>
          <p>${esc(version + size)}</p>
          <a href="app.html?id=${id}">View</a>
        </div>
      </article>
    `;
  };

  const renderGrid = (id, rows, emptyText = "No releases yet.") => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = rows.length ? rows.map(card).join("") :
      `<p style="grid-column:1/-1;color:var(--muted);font-size:13px;margin:4px 0">${esc(emptyText)}</p>`;
  };

  const renderCategories = (apps) => {
    const appLinks = document.getElementById("appCategoryLinks");
    const gameLinks = document.getElementById("gameCategoryLinks");
    if (!appLinks || !gameLinks) return;

    const appGenres = [...new Set(
      apps.filter(a => a.category === "apps").map(a => String(a.genre || "").trim()).filter(Boolean)
    )].sort((a,b) => a.localeCompare(b));

    const gameGenres = [...new Set(
      apps.filter(a => a.category === "games").map(a => String(a.genre || "").trim()).filter(Boolean)
    )].sort((a,b) => a.localeCompare(b));

    const link = (genre, category) => {
      const href = "#";
      return `<a href="${href}" data-hub-genre="${esc(genre)}" data-hub-category="${esc(category)}">${esc(genre)}</a>`;
    };

    appLinks.innerHTML = appGenres.length
      ? appGenres.map(g => link(g,"apps")).join("")
      : "<span style='color:var(--muted);font-size:12px'>No app categories yet.</span>";

    gameLinks.innerHTML = gameGenres.length
      ? gameGenres.map(g => link(g,"games")).join("")
      : "<span style='color:var(--muted);font-size:12px'>No game categories yet.</span>";

    document.querySelectorAll("[data-hub-genre]").forEach(anchor => {
      if (anchor.dataset.hubBound) return;
      anchor.dataset.hubBound = "1";
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        const category = anchor.dataset.hubCategory;
        const genre = norm(anchor.dataset.hubGenre);
        const appsForGenre = apps.filter(a => a.category === category && norm(a.genre) === genre);
        const target = document.getElementById("appsContainer");
        const filters = document.getElementById("filtersSection");
        const home = document.getElementById("homePage");
        if (home) home.style.display = "block";
        if (filters) filters.scrollIntoView({behavior:"smooth",block:"start"});
        if (target) {
          target.innerHTML = appsForGenre.length
            ? appsForGenre.map(a => card(a)).join("")
            : `<p style="color:var(--muted)">No releases in this category yet.</p>`;
        }
      });
    });
  };

  const render = (apps) => {
    if (!Array.isArray(apps)) return;

    const published = apps.slice().sort(byUpdated);
    const appRows = published.filter(a => a.category === "apps");
    const gameRows = published.filter(a => a.category === "games");

    // "Essential" is utility-oriented, not simply the newest six apps.
    const essentialTerms = [
      "video","editor","downloader","music","audio","browser","file",
      "vpn","utility","social","productivity","tool","photo"
    ];
    const essential = appRows.filter(a => {
      const hay = norm([a.name,a.genre,a.description,a.slug].join(" "));
      return essentialTerms.some(term => hay.includes(term));
    }).slice(0,6);

    const premium = appRows.slice(0,6);
    const latestGames = gameRows.slice(0,6);

    const early = published.filter(a => /early access|beta|early-access|test build/i.test(
      [a.name,a.genre,a.description].join(" ")
    )).slice(0,6);

    renderGrid("essentialAppsGrid", essential, "No essential app releases yet.");
    renderGrid("gamesLatestGrid", latestGames, "No game releases yet.");
    renderGrid("premiumAppsGrid", premium, "No premium app releases yet.");

    const earlySection = document.getElementById("early-access");
    if (earlySection) {
      earlySection.hidden = early.length === 0;
      if (early.length) renderGrid("earlyAccessGrid", early);
    }

    renderCategories(published);
  };

  window.TGMHomeSections = { render };
})();
