(() => {
  // Compatibility layer: keep the legacy `apps` global populated from the
  // lightweight catalog endpoint only. Detail pages fetch their own full data
  // when opened. This prevents one homepage load from issuing dozens of D1
  // detail queries.
  var apps = [];
  window.apps = apps;

  const mapRow = (row) => ({
    id: row.slug || row.id,
    slug: row.slug || row.id,
    name: row.name || row.slug || row.id,
    category: row.category_slug || "",
    category_name: row.category_name || "",
    version: row.latest_version || "—",
    size: row.latest_size_bytes && window.TGMApi
      ? window.TGMApi.formatBytes(row.latest_size_bytes)
      : "—",
    image: row.icon_url && window.TGMApi
      ? window.TGMApi.imageUrl(row.icon_url)
      : (row.icon_url || "images/logo.png"),
    icon_url: row.icon_url || "",
    modTitle: row.latest_mod_info || "Release information",
    updated: row.updated_at || "",
    publisher: row.publisher || "",
    genre: row.genre || "",
    playstore: row.play_store_url || "",
    description: row.description_html || "",
    features: row.latest_mod_info
      ? String(row.latest_mod_info).split(/[\n,;]+/).map(s => s.trim()).filter(Boolean)
      : [],
    screenshots: [],
    youtube: "",
    tutorialBody: "",
    androidMin: "",
    architecture: "",
    minSdk: "",
    targetSdk: "",
    changelog: "",
    releaseAssets: [],
    download_apk: "",
    download_extra: ""
  });

  const ready = (async () => {
    if (!window.TGMApi) return apps;

    try {
      const response = await window.TGMApi.listApps({ limit: 100 });
      const rows = Array.isArray(response.apps) ? response.apps : [];
      apps.splice(0, apps.length, ...rows.map(mapRow));
    } catch (error) {
      console.warn("Live catalog bootstrap failed:", error);
    }

    return apps;
  })();

  window.TGM_LIVE_READY = ready;
  window.TGM_LIVE_REFRESH = async () => {
    try {
      const response = await window.TGMApi.listApps({ limit: 100 });
      const rows = Array.isArray(response.apps) ? response.apps : [];
      apps.splice(0, apps.length, ...rows.map(mapRow));
    } catch (error) {
      console.warn("Live catalog refresh failed:", error);
    }
    return apps;
  };
})();
