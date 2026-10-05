(() => {
  if (window.TGMHomeSections) return;

  const esc = (value) => String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

  const text = (value) => String(value || "").trim();
  const norm = (value) => text(value).toLowerCase();

  const featureLine = (app) => {
    const features = Array.isArray(app.features)
      ? app.features.filter(Boolean).map(text).filter(Boolean)
      : [];
    if (features.length) return features.slice(0,3).join(" • ");
    const info = text(app.modTitle);
    return info || text(app.genre) || "Updated release";
  };

  const card = (app) => {
    const name = text(app.name) || "Untitled";
    const version = text(app.version) && text(app.version) !== "—" ? text(app.version) : "—";
    const size = text(app.size) && text(app.size) !== "—" ? text(app.size) : "—";
    const image = text(app.image) || text(app.icon_url) || "images/logo.png";
    const id = encodeURIComponent(app.slug || app.id || "");
    const category = norm(app.category);
    const badge = category === "games" ? "MOD" : "MOD";

    return `
      <article class="tgm-app-row" data-app-href="app.html?id=\${id}" role="link" tabindex="0" aria-label="View \${esc(name)}">
        <a class="tgm-app-image-link" href="app.html?id=${id}" aria-label="View ${esc(name)}">
          <img src="${esc(image)}" alt="${esc(name)}" loading="lazy" onerror="this.src='images/logo.png'">
        </a>
        <div class="tgm-app-copy">
          <h3 title="${esc(name)}">${esc(name)}</h3>
          <div class="tgm-meta">☁ <span>${esc(version)}</span> &nbsp;&nbsp; ▣ <span>${esc(size)}</span></div>
          <div class="tgm-featureline">🛠 <span>${esc(featureLine(app))}</span></div>
        </div>
        <a class="tgm-badge" href="app.html?id=${id}">${badge}</a>
      </article>
    `;
  };

  const bindCardNavigation = (root) => {
    root.querySelectorAll(".tgm-app-row").forEach(row => {
      if (row.dataset.cardBound) return;
      row.dataset.cardBound = "1";
      row.addEventListener("click", event => {
        if (event.target.closest("a,button,input,select,textarea")) return;
        const href = row.dataset.appHref;
        if (href) window.location.href = href;
      });
      row.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.target.closest("a,button,input,select,textarea")) return;
        event.preventDefault();
        const href = row.dataset.appHref;
        if (href) window.location.href = href;
      });
    });
  };

  const renderGrid = (id, apps, emptyText) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = apps.length
      ? apps.map(card).join("")
      : `<p style="grid-column:1/-1;color:var(--muted);font-size:12px;padding:8px 2px">${esc(emptyText || "No releases yet.")}</p>`;
    bindCardNavigation(el);
  };

  const scoreForEssential = (app) => {
    const hay = norm([app.name,app.genre,app.description,app.slug].join(" "));
    const terms = ["tiktok","spotify","youtube","snap","photo","video","editor","music","browser","download","whatsapp","telegram","vpn","file","utility","social"];
    return terms.reduce((score, term) => score + (hay.includes(term) ? 10 : 0), 0);
  };

  const renderCategories = (apps) => {
    const appLinks = document.getElementById("appCategoryLinks");
    const gameLinks = document.getElementById("gameCategoryLinks");
    if (!appLinks || !gameLinks) return;

    const build = (category) => [...new Set(
      apps.filter(a => a.category === category)
        .map(a => text(a.genre))
        .filter(Boolean)
    )].sort((a,b) => a.localeCompare(b));

    const makeLinks = (genres, category) => genres.length
      ? genres.map(genre =>
          `<a href="#" data-hub-genre="${esc(genre)}" data-hub-category="${esc(category)}">${esc(genre)}</a>`
        ).join("")
      : "<span style='color:var(--muted);font-size:12px'>No categories yet.</span>";

    appLinks.innerHTML = makeLinks(build("apps"), "apps");
    gameLinks.innerHTML = makeLinks(build("games"), "games");

    document.querySelectorAll("[data-hub-genre]").forEach(anchor => {
      if (anchor.dataset.hubBound) return;
      anchor.dataset.hubBound = "1";
      anchor.addEventListener("click", event => {
        event.preventDefault();
        const category = anchor.dataset.hubCategory || "apps";
        const genre = norm(anchor.dataset.hubGenre);
        const matches = apps.filter(a =>
          a.category === category && norm(a.genre) === genre
        );
        const dashboard = document.getElementById("catalogDashboard");
        if (dashboard) dashboard.style.display = "none";
        const legacy = document.getElementById("legacySearchArea");
        if (legacy) legacy.style.display = "block";
        const filters = document.getElementById("filtersSection");
        if (filters) filters.style.display = "none";
        const grid = document.getElementById("appsContainer");
        if (grid) grid.innerHTML = matches.map(card).join("");
        window.scrollTo({top:0,left:0,behavior:"smooth"});
      });
    });
  };

  const render = (apps) => {
    if (!Array.isArray(apps)) return;

    const published = apps.filter(a => a && a.id).slice().sort((a,b) =>
      String(b.updated || "").localeCompare(String(a.updated || ""))
    );

    const appRows = published.filter(a => a.category === "apps");
    const gameRows = published.filter(a => a.category === "games");

    const essential = appRows
      .slice()
      .sort((a,b) => scoreForEssential(b)-scoreForEssential(a) || String(a.name).localeCompare(String(b.name)))
      .slice(0,4);

    const gamesLatest = gameRows.slice(0,4);

    const premium = appRows.slice(0,8).filter(a =>
      /premium|pro|unlocked|ad.?free|no ads|mod/i.test(
        [a.modTitle,a.description,a.genre].join(" ")
      )
    ).slice(0,4);

    const used = new Set([...essential,...gamesLatest,...premium].map(a => a.id));
    const editors = published
      .filter(a => !used.has(a.id))
      .slice(0,4);

    const early = published.filter(a =>
      /early access|beta|early-access|preview|test build/i.test(
        [a.name,a.genre,a.description].join(" ")
      )
    ).slice(0,4);

    renderGrid("essentialAppsGrid", essential, "No essential app releases yet.");
    renderGrid("gamesLatestGrid", gamesLatest, "No game releases yet.");
    renderGrid("premiumAppsGrid", premium, "No premium app releases yet.");
    renderGrid("editorsChoiceGrid", editors, "No editor's choice releases yet.");

    const earlySection = document.getElementById("early-access");
    if (earlySection) {
      earlySection.hidden = early.length === 0;
      if (early.length) renderGrid("earlyAccessGrid", early, "No early-access releases yet.");
    }

    renderCategories(published);
  };

  window.TGMHomeSections = { render };
})();
