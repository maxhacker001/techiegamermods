/* Lightweight page hardening.
 * Download/link behavior is owned by the page that renders the button.
 * This file must never hijack arbitrary buttons on the site.
 */
document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (e.key === "F12" || (e.ctrlKey && e.shiftKey && (key === "i" || key === "j")) || (e.ctrlKey && key === "u")) {
    e.preventDefault();
  }
});
