let time = 5;
const btn = document.getElementById("downloadBtn");
const counter = document.getElementById("countdown");

if (btn && counter) {
  const timer = setInterval(() => {
    time--;
    counter.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      btn.textContent = "⬇ DOWNLOAD APK";
      btn.classList.remove("disabled");
      btn.onclick = () => window.location.href = btn.dataset.link;
    }
  }, 1000);
}
