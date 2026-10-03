(() => {
  // Compatibility layer for older page code.
  // The catalog is no longer hard-coded here: D1/CMS is the source of truth.
  var apps = [];
  window.apps = apps;

  const ready = new Promise((resolve) => {
    const start = () => {
      if (!window.TGMApi) {
        setTimeout(start, 25);
        return;
      }

      load().then(resolve).catch((error) => {
        console.warn("Live catalog bootstrap failed:", error);
        resolve([]);
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }
  });

  const cleanLines = (value) => String(value || "")
    .replace(/\r/g, "")
    .split(/\n|<br\s*\/?>/i)
    .map(s => s.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);

  const mapLiveApp = async (row) => {
    const slug = row.slug || row.id;
    try {
      const live = await window.TGMApi.getApp(slug);
      const app = live.app || row;
      const versions = Array.isArray(live.versions) ? live.versions : [];
      const latest = versions[0] || null;
      const files = Array.isArray(live.files) ? live.files : [];
      const publishedFile = latest
        ? files.find(file => file.version_id === latest.id) || files[0] || null
        : null;

      const tutorial = Array.isArray(live.tutorials)
        ? live.tutorials.find(item => item.video_url) || live.tutorials[0] || null
        : null;

      const infoLines = latest
        ? cleanLines(latest.mod_info || "")
        : cleanLines(row.latest_mod_info || "");

      const tutorialLines = tutorial
        ? cleanLines(tutorial.body || "")
        : [];

      const isTutorial = String(app.category_slug || row.category_slug || "")
        .toLowerCase() === "tutorials";

      return {
        id: app.slug || app.id || slug,
        slug: app.slug || app.id || slug,
        name: app.name || row.name || slug,
        category: app.category_slug || row.category_slug || "",
        category_name: app.category_name || row.category_name || "",
        version: latest?.version_name || row.latest_version || "—",
        size: publishedFile
          ? window.TGMApi.formatBytes(publishedFile.bytes)
          : (latest?.size_bytes
            ? window.TGMApi.formatBytes(latest.size_bytes)
            : "—"),
        image: app.icon_url
          ? window.TGMApi.imageUrl(app.icon_url)
          : "images/logo.png",
        icon_url: app.icon_url || "",
        modTitle: isTutorial
          ? (tutorial?.title || app.name || row.name || "Video Tutorial")
          : (infoLines[0] || "Release information"),
        updated: app.updated_at || row.updated_at || "",
        publisher: app.publisher || row.publisher || "",
        genre: app.genre || row.genre || "",
        playstore: app.play_store_url || row.play_store_url || "",
        description: app.description_html || row.description_html || "",
        features: isTutorial
          ? (tutorialLines.length ? tutorialLines : ["Complete tutorial"])
          : infoLines,
        screenshots: (live.screenshots || []).map(shot =>
          window.TGMApi.imageUrl(shot.media_url)
        ),
        youtube: tutorial?.video_url || "",
        tutorialBody: tutorial?.body || "",
        androidMin: latest?.android_min || "",
        architecture: latest?.architecture || "",
        changelog: latest?.changelog || "",
        download_apk: publishedFile ? publishedFile.id : "",
        download_extra: ""
      };
    } catch (error) {
      return {
        id: row.slug || row.id,
        slug: row.slug || row.id,
        name: row.name || row.slug || row.id,
        category: row.category_slug || "",
        category_name: row.category_name || "",
        version: row.latest_version || "—",
        size: row.latest_size_bytes
          ? window.TGMApi.formatBytes(row.latest_size_bytes)
          : "—",
        image: row.icon_url
          ? window.TGMApi.imageUrl(row.icon_url)
          : "images/logo.png",
        icon_url: row.icon_url || "",
        modTitle: cleanLines(row.latest_mod_info || "")[0] || "Release information",
        updated: row.updated_at || "",
        publisher: row.publisher || "",
        genre: row.genre || "",
        playstore: row.play_store_url || "",
        description: row.description_html || "",
        features: cleanLines(row.latest_mod_info || ""),
        screenshots: [],
        youtube: "",
        tutorialBody: ""
      };
    }
  };

  async function load() {
    if (!window.TGMApi) return apps;

    const response = await window.TGMApi.listApps({ limit: 100 });
    const rows = Array.isArray(response.apps) ? response.apps : [];
    const hydrated = [];

    // Keep requests bounded so the Admin/public pages do not create a burst
    // of 100 simultaneous Worker requests.
    for (let start = 0; start < rows.length; start += 6) {
      const batch = rows.slice(start, start + 6);
      const resolved = await Promise.all(batch.map(mapLiveApp));
      hydrated.push(...resolved);
    }

    apps.splice(0, apps.length, ...hydrated);
    return apps;
  }

  window.TGM_LIVE_READY = ready;
  window.TGM_LIVE_REFRESH = load;
})();
