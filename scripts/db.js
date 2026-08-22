let mode = "junior";
let maxDB = 6;
let maxR = 3;
let currentFamily = "jump";
let entries = [];
let currentPenalty = 0;

const valueGrid = document.getElementById("value-grid");
for (let index = 0; index <= 25; index += 1) {
  const button = document.createElement("button");
  button.className = "btn-val";
  button.type = "button";
  button.textContent = (index / 10).toFixed(1);
  button.dataset.value = button.textContent;
  valueGrid.appendChild(button);
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", event => {
    document.querySelectorAll(".tab").forEach(item => item.classList.remove("active"));
    event.currentTarget.classList.add("active");
    currentFamily = event.currentTarget.dataset.family;
  });
});

function recomputeCounts() {
  entries.forEach(entry => { entry.counted = false; });
  [...entries].filter(entry => entry.kind === "DB" && entry.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, maxDB)
    .forEach(entry => { entry.counted = true; });
  entries.filter(entry => entry.kind === "R").slice(0, maxR)
    .forEach(entry => { entry.counted = true; });

  currentPenalty = ["jump", "balance", "rotation"]
    .filter(group => !entries.some(entry => entry.kind === "DB" && entry.family === group)).length * 0.3;
}

function finalScore() {
  return entries.filter(entry => entry.counted).reduce((sum, entry) => sum + entry.value, 0) - currentPenalty;
}

function render() {
  setText("final-score", formatScore(finalScore()));
  setText("penalty-info", `Penalty: ${formatScore(currentPenalty)}`);
  const history = document.getElementById("history");
  history.replaceChildren();
  entries.forEach((entry, index) => {
    const item = document.createElement("div");
    item.className = "history-item";
    const family = entry.family[0].toUpperCase() + entry.family.slice(1);
    item.innerHTML = `<span>#${index + 1}</span> <span>${family} ${formatScore(entry.value, 1)}</span> <span class="${entry.counted ? "status-counted" : "status-not"}">${entry.counted ? "COUNTED" : " NOT COUNTED"}</span>`;
    history.appendChild(item);
  });
}

valueGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-value]");
  if (!button) return;
  entries.push({ kind: currentFamily === "risk" ? "R" : "DB", family: currentFamily, value: parseFloat(button.dataset.value), counted: false });
  recomputeCounts();
  render();
});

document.getElementById("btn-undo").addEventListener("click", () => {
  entries.pop();
  recomputeCounts();
  render();
});
document.getElementById("btn-reset").addEventListener("click", () => {
  entries = [];
  recomputeCounts();
  render();
});

function setMode(nextMode) {
  mode = nextMode;
  maxDB = mode === "junior" ? 6 : 8;
  maxR = mode === "junior" ? 3 : 4;
  document.getElementById("mode-junior").classList.toggle("active", mode === "junior");
  document.getElementById("mode-senior").classList.toggle("active", mode === "senior");
  recomputeCounts();
  render();
}
document.getElementById("mode-junior").addEventListener("click", () => setMode("junior"));
document.getElementById("mode-senior").addEventListener("click", () => setMode("senior"));

document.getElementById("btn-validate").addEventListener("click", () => {
  setText("modal-score", formatScore(finalScore()));
  setText("modal-penalty", `Penalty applied: ${formatScore(currentPenalty)}`);
  openModal("modal-overlay");
});
document.getElementById("modal-cancel").addEventListener("click", () => closeModal("modal-overlay"));
document.getElementById("modal-confirm").addEventListener("click", () => closeModal("modal-overlay"));

recomputeCounts();
render();
