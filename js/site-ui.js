(() => {
  if (window.__TGM_SHARED_UI_READY__) return;
  window.__TGM_SHARED_UI_READY__ = true;

  const setup = () => {
    const menu = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    const drawer = {
      open() {
        if (!sidebar || !overlay) return;
        sidebar.classList.add("open");
        overlay.classList.add("open");
        document.documentElement.classList.add("tgm-drawer-open");
        document.body.classList.add("tgm-drawer-open");
      },
      close() {
        if (sidebar) sidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("open");
        document.documentElement.classList.remove("tgm-drawer-open");
        document.body.classList.remove("tgm-drawer-open");
      },
      toggle() {
        if (sidebar?.classList.contains("open")) this.close();
        else this.open();
      }
    };
    window.TGMDrawer = drawer;

    if (menu && window.matchMedia("(max-width:680px)").matches) {
      menu.style.position = "absolute";
      menu.style.top = "3px";
      menu.style.left = "4px";
    }

    if (menu && sidebar && overlay && !menu.dataset.uiBound) {
      menu.dataset.uiBound = "1";
      menu.addEventListener("click", () => drawer.toggle());
      overlay.addEventListener("click", () => drawer.close());
      sidebar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => drawer.close());
      });
    }

    const modeToggles = document.querySelectorAll(".mode-toggle");
    const modeTextNodes = document.querySelectorAll("#modeText");
    if (modeToggles.length) {
      const apply = () => {
        const light = localStorage.getItem("theme") === "light";
        document.body.classList.toggle("light", light);
        modeTextNodes.forEach(node => {
          node.textContent = light ? "🌙 Dark Mode" : "☀ Light Mode";
        });
      };
      apply();
      modeToggles.forEach(modeToggle => {
        if (modeToggle.dataset.uiBound) return;
        modeToggle.dataset.uiBound = "1";
        modeToggle.addEventListener("click", event => {
          event.preventDefault();
          localStorage.setItem(
            "theme",
            document.body.classList.contains("light") ? "dark" : "light"
          );
          apply();
        });
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
})();