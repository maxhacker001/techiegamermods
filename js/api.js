(() => {
  const base = String(window.TGM_API_BASE || "").replace(/\/$/, "");
  if (!base) return;

  window.TGMApi = {
    base,
    async getApp(slug) {
      const response = await fetch(base + "/api/apps/" + encodeURIComponent(slug), {
        headers: { accept: "application/json" }
      });
      if (!response.ok) throw new Error("API returned HTTP " + response.status);
      return response.json();
    },
    async listApps(params = {}) {
      const query = new URLSearchParams(params);
      const response = await fetch(base + "/api/apps?" + query.toString(), {
        headers: { accept: "application/json" }
      });
      if (!response.ok) throw new Error("API returned HTTP " + response.status);
      return response.json();
    }
  };
})();
