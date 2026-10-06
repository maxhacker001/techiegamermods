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
    "vn-video-editor-mod": "https://play-lh.googleusercontent.com/AdmVEf1YsnbcTx7OFNNbJkqLbLewomf6xR4wWnazycJJC4llEXjmBOixxcgGt3TFa_IZszY9gw-4UOGYKlaKMw%3Dw240-h480",
    "telegram-premium-mod": "https://play-lh.googleusercontent.com/PyZ3akMGXPV0tKKirKNwfO--PSQW3FHR6rD_H9mAaukZ8LiHyYFuBLeU8UZ2ok6r5SP79-3prkfybWKh98AZAD0%3Dw240-h480",
    "crunchyroll-mod": "https://play-lh.googleusercontent.com/FUEOotGzxEZqItvGGov0YBiOhZBCACxCM6kF37OtpWrCG9H6EyxSeY2G8PDXQGueLxlxtL3Xr0fbkvXaQ67NLg%3Dw240-h480",
    "instagram-pro-insta-thunder": "https://play-lh.googleusercontent.com/yHi59jmO_lVamcyJ1i3rM1_E8bAiAspShnGjjURq05ipQQSUksO3QVEsXTegRSqul038-4YNA7O644XAcx251Q%3Dw240-h480",
    "twitter-x-gold-mod": "https://play-lh.googleusercontent.com/IsLsCD4eLC2CYvlkgTI6Z5TROj0BJIBgUF7BZ5eliTzyyTjqG_mbofeG4kw2s7oG_JZMSi5ErLz_qsDi169C8w%3Dw240-h480",
    "netflix-mod": "https://cdn.mos.cms.futurecdn.net/sZKx8M5MGrKjk7L7748Dkc.jpg",
    "mobile-legends-mod": "https://apps.apple.com/ni/app/mobile-legends-bang-bang/id1160056295",
    "subway-surfers-mod": "https://play-lh.googleusercontent.com/-b6afYVP9kkzaFgDT3bZpGy2ugh1AjzCiXS0o9aZw7bIZ5rCb3Bp8YAwIxyMjUGLjl1pD6ZFGxeKKGlXBw950g%3Dw240-h480",
    "candy-crush-saga-mod": "https://play-lh.googleusercontent.com/JvMhIxuwArVmcMReJQB8PIEB1MIQNMGf9j5i914JtkBrHrA55K-nMUIVlYCa7SXAdHtzLtsycEo6NpXeHFxLwvI%3Dw240-h480",
    "clash-of-clans-mod": "https://play-lh.googleusercontent.com/sFmWfYbYp_2ea7VRMTnwd3gjIBrPGXHj_d_ab1_k1q1p2OMk4riGMF1vqxdhONOtTYOt_BVpk7a4AYcKU68LNGQ%3Dw240-h480",
    "roblox-mod": "https://play-lh.googleusercontent.com/QqZj22aXblAyYDxLQw-Gg0ycW0QkKhrDnwqgERZU9BMRXZnMlgXfq-94sikG5mEpt_I0lzZxcUzfLblmQgwYzUE%3Dw240-h480",
    "call-of-duty-mobile-mod": "https://apps.apple.com/jp/app/call-of-duty-mobile/id1287282214",
    "among-us-mod": "https://play-lh.googleusercontent.com/pfGArJJx-vtMRVu2-ziedzAhTLsHgks6N3mNyyOC0oxRdsXINGwdd9h4ZutdTG7MfgiqlDXBXnk-kNo-Fns70Q%3Dw240-h480",
    "stumble-guys-mod": "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e6/19/cd/e619cd22-594b-2a59-7576-1a57d2c7932b/AppIcon-0-0-1x_U007emarketing-0-5-0-85-220.png/0x0ss-85.png",
    "brawl-stars-mod": "https://play-lh.googleusercontent.com/wEOIM7cYyXkMExNztvFYKHJLPegXp6h81-P_JQQ_9KQvDCWK49m2zpt1mTRXO5bA2qU_Bp4em_nfMsHXmq8Z%3Dw240-h480",
    "shadow-fight-3-mod": "https://apps.apple.com/us/app/shadow-fight-3-rpg-fighting/id964827011",
    "dream-league-soccer-mod": "https://is5-ssl.mzstatic.com/image/thumb/Purple62/v4/ed/cd/37/edcd3789-22b6-88ed-f2f6-4265718629e1/mzl.iysfrduj.png/1200x630wa.jpg",
    "hill-climb-racing-mod": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d0/b2/3c/d0b23c6f-1b9e-3bb9-f147-2bcfd0ef86e2/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/640x640bb.webp",
    "8-ball-pool-mod": "https://play-lh.googleusercontent.com/F2_Kbn1-vQePDh_Y0qNCDhkmpEK5qdEyPwcJqwXho54ZVG4w6Szt32VHsyPzeVLPR2kfYI62-hGmNpQoDxS-wQ%3Ds48",
    "powerdirector-mod": "https://play-lh.googleusercontent.com/v0kLUsvwfgvcHJcHPcCRBmXaAwnvFVLiv0XVkuSIc6BCtqc6vBvPVZ5K5GqjC52hf4K0SLOYSKbplAzFxnr5qg%3Dw240-h480",
    "snaptube-mod": "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/d0/b2/3c/d0b23c6f-1b9e-3bb9-f147-2bcfd0ef86e2/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/640x640bb.webp"
  };


  const imageUrl = (value) => {
    if (!value) return "images/logo.png";
    const raw = String(value).trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    const clean = raw.replace(/^\.\//, "").replace(/^\//, "");
    return base + "/" + clean;
  };

  const imageForApp = (record = {}) => {
    const slug = String(record.slug || record.id || "").trim();
    const value = String(record.icon_url || record.image || "").trim();

    // A live record can legitimately have no icon. Use the per-app fallback
    // before falling back to the Techie Gamer logo.
    if (iconFallbacks[slug]) {
      if (!value || /(?:^|\/)logo\.png$/i.test(value) || /(?:^|\/)images\/[^/]+\.png$/i.test(value)) {
        return iconFallbacks[slug];
      }
    }

    return value ? imageUrl(value) : (iconFallbacks[slug] || "images/logo.png");
  };

  const normalizeListApp = (row) => ({
    id: row.slug || row.id,
    slug: row.slug || row.id,
    name: row.name,
    category: row.category_slug,
    version: row.latest_version || "—",
    size: formatBytes(row.latest_size_bytes),
    image: imageForApp(row),
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
    imageForApp,
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
