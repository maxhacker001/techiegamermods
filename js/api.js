(() => {
  const base = String(window.TGM_API_BASE || "").replace(/\/$/, "");
  if (!base) return;

  const formatBytes = (bytes) => {
    const n = Number(bytes || 0);
    if (!n) return "—";
    const units = ["B","KB","MB","GB","TB"];
    const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
    return (n / Math.pow(1024, i)).toFixed(i ? 2 : 0) + " " + units[i];
  };

  const imageUrl = (value) => {
    if (!value) return "images/logo.png";
    if (/^https?:\/\//i.test(value)) return value;
    return base + (value.startsWith("/") ? value : "/" + value);
  };

  const normalizeListApp = (row) => ({
    id: row.slug || row.id,
    slug: row.slug || row.id,
    name: row.name,
    category: row.category_slug,
    version: row.latest_version || "—",
    size: formatBytes(row.latest_size_bytes),
    image: imageUrl(row.icon_url),
    modTitle: row.latest_mod_info || "Release information",
    updated: row.updated_at || "",
    publisher: row.publisher || "",
    genre: row.genre || "",
    playstore: row.play_store_url || "",
    description: row.description_html || "",
    features: row.latest_mod_info ? [row.latest_mod_info] : []
  });

  window.TGMApi = {
    base,
    formatBytes,
    imageUrl,
    normalizeListApp,
    async getApp(slug, options = {}) {
      const timeoutMs = Number(options.timeoutMs || 10000);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(base + "/api/apps/" + encodeURIComponent(slug), {
          headers: { accept: "application/json" },
          signal: options.signal || controller.signal
        });
        if (!response.ok) throw new Error("API returned HTTP " + response.status);
        return response.json();
      } finally {
        clearTimeout(timer);
      }
    },
    async listApps(params = {}, options = {}) {
      const query = new URLSearchParams(params);
      const timeoutMs = Number(options.timeoutMs || 10000);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(base + "/api/apps?" + query.toString(), {
          headers: { accept: "application/json" },
          signal: options.signal || controller.signal
        });
        if (!response.ok) throw new Error("API returned HTTP " + response.status);
        return response.json();
      } finally {
        clearTimeout(timer);
      }
    }
  };
})();
