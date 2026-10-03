/*
 * Public API configuration.
 *
 * Leave empty while the site uses the legacy local catalog.
 * After the Cloudflare Worker is deployed, put its public URL here,
 * for example: https://techie-gamer-mods-api.<your-subdomain>.workers.dev
 */
window.TGM_API_BASE = "https://techie-gamer-mods-api.talktomartinz.workers.dev";
// Public contact destinations. Keep these here so the same links can be
// reused across the public app/download pages without changing catalog logic.
window.TGM_CONTACT_LINKS = {
  telegramChannel: "https://t.me/techiegamer10",
  whatsappPersonal: "https://wa.me/2349034211288",
  whatsappCommunity: "https://chat.whatsapp.com/I4Wvi5vhWHYGNEfrlwgEMv",
  liveChatDestination: "whatsapp",
  // Set this to your YouTube channel URL to enable the tutorial subscription button.
  youtubeChannel: ""
};
