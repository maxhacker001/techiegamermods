(() => {
  if (window.__TGM_SHARED_UI_READY__) return;
  window.__TGM_SHARED_UI_READY__ = true;

  const setup = () => {
    const menu = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (menu && sidebar && overlay && !menu.dataset.uiBound) {
      menu.dataset.uiBound = "1";
      const close = () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("open");
      };
      menu.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("open");
      });
      overlay.addEventListener("click", close);
      sidebar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          close();
        });
      });
    }

    const modeToggle = document.querySelector(".mode-toggle");
    const modeText = document.getElementById("modeText");
    if (modeToggle && modeText && !modeToggle.dataset.uiBound) {
      modeToggle.dataset.uiBound = "1";
      const apply = () => {
        const light = localStorage.getItem("theme") === "light";
        document.body.classList.toggle("light", light);
        modeText.textContent = light ? "🌙 Dark Mode" : "☀ Light Mode";
      };
      apply();
      modeToggle.addEventListener("click", event => {
        event.preventDefault();
        localStorage.setItem(
          "theme",
          document.body.classList.contains("light") ? "dark" : "light"
        );
        apply();
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
})();