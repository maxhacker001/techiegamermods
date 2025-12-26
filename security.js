document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", e => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey) ||
    (e.ctrlKey && e.key.toLowerCase() === "u")
  ) e.preventDefault();
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".download-btn");
  if (!btn) return;

  let count = 3;

  btn.onclick = () => {
    btn.disabled = true;
    btn.textContent = `Preparing download... ${count}`;

    const timer = setInterval(() => {
      count--;
      btn.textContent = `Preparing download... ${count}`;

      if (count === 0) {
        clearInterval(timer);
        btn.textContent = "✔ Verified — Downloading";
        window.location.href = btn.dataset.link;
      }
    }, 1000);
  };
});