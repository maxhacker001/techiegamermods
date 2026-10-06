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

  // Missing legacy icon files are served from verified Google Play icon
  // assets where available. SnapTube has no official Play Store listing in
  // this catalog, so its fallback uses a web-search image source.
  const iconFallbacks = {
    "images/vn.png": "https://play-lh.googleusercontent.com/AdmVEf1YsnbcTx7OFNNbJkqLbLewomf6xR4wWnazycJJC4llEXjmBOixxcgGt3TFa_IZszY9gw-4UOGYKlaKMw%3Dw240-h480",
    "images/telegram.png": "https://play-lh.googleusercontent.com/PyZ3akMGXPV0tKKirKNwfO--PSQW3FHR6rD_H9mAaukZ8LiHyYFuBLeU8UZ2ok6r5SP79-3prkfybWKh98AZAD0%3Dw240-h480",
    "images/crunchyroll.png": "https://play-lh.googleusercontent.com/7z8uK3qVDcXFvuV1oJtr8Olc_kbIzPUCaoE_rKYz9s7-qPavU3zHA5-_iV5SxCrB8vczssQznHlgHmGRx__r5g%3Dw240-h480",
    "images/instathunder.png": "https://play-lh.googleusercontent.com/yHi59jmO_lVamcyJ1i3rM1_E8bAiAspShnGjjURq05ipQQSUksO3QVEsXTegRSqul038-4YNA7O644XAcx251Q%3Dw240-h480",
    "images/twittergold.png": "https://play-lh.googleusercontent.com/IsLsCD4eLC2CYvlkgTI6Z5TROj0BJIBgUF7BZ5eliTzyyTjqG_mbofeG4kw2s7oG_JZMSi5ErLz_qsDi169C8w%3Dw240-h480",
    "images/netflix.png": "https://play-lh.googleusercontent.com/fXVS45nukV1x9PYVSKHkCQK0QGCOishIvAOxIZS3sgRem8HS7l9l94_Ggj-WZPrTLePRdNYN4pp4SPAQL7oS0PU%3Dw240-h480",
    "images/mlbb.png": "https://play-lh.googleusercontent.com/MztmLpB1-_eFbHnqNzzvzl5zjiOH2BEb0D71uBxZYf_4BEmW3QEPWODhRtyqY7Qz4wRLwQ--Rg1RAjOFqtHSs-o%3Dw240-h480",
    "images/subwaysurfers.png": "https://play-lh.googleusercontent.com/-b6afYVP9kkzaFgDT3bZpGy2ugh1AjzCiXS0o9aZw7bIZ5rCb3Bp8YAwIxyMjUGLjl1pD6ZFGxeKKGlXBw950g%3Dw240-h480",
    "images/candycrush.png": "https://play-lh.googleusercontent.com/JvMhIxuwArVmcMReJQB8PIEB1MIQNMGf9j5i914JtkBrHrA55K-nMUIVlYCa7SXAdHtzLtsycEo6NpXeHFxLwvI%3Dw240-h480",
    "images/clashclans.png": "https://play-lh.googleusercontent.com/sFmWfYbYp_2ea7VRMTnwd3gjIBrPGXHj_d_ab1_k1q1p2OMk4riGMF1vqxdhONOtTYOt_BVpk7a4AYcKU68LNGQ%3Dw240-h480",
    "images/roblox.png": "https://play-lh.googleusercontent.com/QqZj22aXblAyYDxLQw-Gg0ycW0QkKhrDnwqgERZU9BMRXZnMlgXfq-94sikG5mEpt_I0lzZxcUzfLblmQgwYzUE%3Dw240-h480",
    "images/codmobile.png": "https://play-lh.googleusercontent.com/tcQ_YQhK2D8n5xO2mG1kR6c5Ih0V1Z2Xj4bY2B9mC2qD0p3nD2w6fX6y8zP8j3s4mQ5bE6cF7dG8hI9jK0lM%3Dw240-h480",
    "images/amongus.png": "https://play-lh.googleusercontent.com/pfGArJJx-vtMRVu2-ziedzAhTLsHgks6N3mNyyOC0oxRdsXINGwdd9h4ZutdTG7MfgiqlDXBXnk-kNo-Fns70Q%3Dw240-h480",
    "images/stumbleguys.png": "https://play-lh.googleusercontent.com/Qr95gFdl_scidWsdHVP1f7FXe9fSgfrHhCyK0T6UnN4Ru-6PrTgaVN7CSfkrG5JzsQFpBWNiXLyBDzcIx7U-%3Dw240-h480",
    "images/brawlstars.png": "https://play-lh.googleusercontent.com/wEOIM7cYyXkMExNztvFYKHJLPegXp6h81-P_JQQ_9KQvDCWK49m2zpt1mTRXO5bA2qU_Bp4em_nfMsHXmq8Z%3Dw240-h480",
    "images/shadowfight3.png": "https://play-lh.googleusercontent.com/2_0WBpfWbTU9FbbgblMDNxKexPDLEfXP8RZ7kYiPlIBZO8NT5q6ptklpAUh34zYO5exHsIbg83cNRPUxWTyFRT0%3Dw240-h480",
    "images/dreamleague.png": "https://play-lh.googleusercontent.com/ldysRAGsIH0zWeNoCMhAUNx6OXp6SuNyeSMXiW7SHTluJVAkfxHP2XLTlxiV9WkBvvE2JXsK08JveGAuGNZNMw%3Dw240-h480",
    "images/hillclimb.png": "https://play-lh.googleusercontent.com/7YJtBKClRTrPRIO-vm-_GoqAEwob4kQ-wJd0qmUMLdbor5Jxj-IKpsXOj6MQejf2XYN9YE0q6IUgYnu-fcAGIg%3Dw240-h480",
    "images/8ballpool.png": "https://play-lh.googleusercontent.com/F2_Kbn1-vQePDh_Y0qNCDhkmpEK5qdEyPwcJqwXho54ZVG4w6Szt32VHsyPzeVLPR2kfYI62-hGmNpQoDxS-wQ%3Dw240-h480",
    "images/powerdirector.png": "https://play-lh.googleusercontent.com/v0kLUsvwfgvcHJcHPcCRBmXaAwnvFVLiv0XVkuSIc6BCtqc6vBvPVZ5K5GqjC52hf4K0SLOYSKbplAzFxnr5qg%3Dw240-h480",
    "images/snaptube.png": "https://el-mejor.com/imagenes/snaptube-1024x1024.jpg"
  };

  const imageUrl = (value) => {
    if (!value) return "images/logo.png";
    if (/^https?:\/\//i.test(value)) return value;
    const clean = value.replace(/^\.\//, "").replace(/^\//, "");
    if (iconFallbacks[clean]) return iconFallbacks[clean];
    return base + "/" + clean;
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
