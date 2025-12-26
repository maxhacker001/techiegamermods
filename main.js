const container = document.getElementById("appsContainer");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentCategory = "apps";

if (container) {
  // ================= INDEX PAGE =================
  function render(list) {
    container.innerHTML = "";
    if (list.length === 0) {
      container.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:var(--muted);'>No mods found 😔</p>";
      return;
    }
    list.forEach(app => {
      container.innerHTML += `
        <div class="card">
          <img src="${app.image}" 
               alt="${app.name}" 
               onerror="this.src='images/logo.png'; this.onerror=null;">
          <h3>${app.name}</h3>
          <p>${app.version} • ${app.size}</p>
          <a href="app.html?id=${app.id}">View Mod</a>
        </div>
      `;
    });
  }

  function filterAndRender() {
    let filtered = apps.filter(a => a.category === currentCategory);

    if (searchInput && searchInput.value) {
      const q = searchInput.value.toLowerCase();
      filtered = filtered.filter(a => a.name.toLowerCase().includes(q));
    }

    render(filtered);
  }

  filterAndRender();

  if (searchInput) {
    searchInput.addEventListener("input", filterAndRender);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      filterAndRender();
    });
  });

} else {
  // ================= APP DETAIL PAGE =================
  const params = new URLSearchParams(window.location.search);
  const appId = params.get("id");

  if (appId) {
    const app = apps.find(a => a.id === appId);

    if (app) {
      document.title = `${app.name} | TECHIE GAMER MODS`;
      document.getElementById("pageTitle").textContent = app.name;

      document.getElementById("appImage").src = app.image;
      document.getElementById("appName").textContent = app.name;
      document.getElementById("appVersion").textContent = `v${app.version}`;
      document.getElementById("appVersion2").textContent = app.version;
      document.getElementById("appSize").textContent = app.size;
      document.getElementById("appSize2").textContent = app.size;

      const list = document.getElementById("features");
      list.innerHTML = "";
      app.features.forEach(f => {
        list.innerHTML += `<li>${f}</li>`;
      });

      const downloadBtn = document.getElementById("downloadBtn");
      downloadBtn.dataset.link = app.download;
    } else {
      document.body.innerHTML = "<h1 style='text-align:center; margin:100px; color:var(--neon);'>Mod Not Found 😢</h1>";
    }
  }
}