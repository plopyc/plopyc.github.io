let difficulties = [];
let aCount = 0;
let maxDA = 12;

const undoButton = document.getElementById("btn-undo");
const footerList = document.getElementById("footer-list");
const lastDifficulty = document.getElementById("last-difficulty");
const centerScore = document.getElementById("center-score");
const modal = document.getElementById("modal-backdrop");

function totalDA() {
  return difficulties.filter(item => item.counted).reduce((sum, item) => sum + item.value, 0);
}

function render() {
  const total = totalDA();
  centerScore.textContent = formatScore(total);
  undoButton.disabled = difficulties.length === 0;
  lastDifficulty.textContent = difficulties.length
    ? `${formatScore(difficulties[difficulties.length - 1].value, 1)}${difficulties[difficulties.length - 1].isA ? " (A)" : ""}`
    : "-";

  footerList.replaceChildren();
  difficulties.forEach((item, index) => {
    const entry = document.createElement("div");
    entry.className = "footer-item";
    entry.innerHTML = `<span class="index">#${index + 1}</span> <span class="value">DA ${formatScore(item.value)}</span> <span class="${item.counted ? "status-counted" : "status-not"}">${item.counted ? "COUNTED" : "NOT COUNTED"}</span>`;
    footerList.appendChild(entry);
  });
}

function addDifficulty(value, isA = false) {
  const counted = difficulties.length < maxDA && (!isA || aCount < 3);
  difficulties.push({ value: counted ? value : 0, isA, counted });
  if (isA) aCount += 1;
  render();
}

function markLastAsA() {
  if (!difficulties.length) return;
  const item = difficulties[difficulties.length - 1];
  if (item.isA) return;
  item.isA = true;
  if (aCount >= 3 || !item.counted) {
    item.value = 0;
    item.counted = false;
  }
  aCount += 1;
  render();
}

document.querySelectorAll("[data-value]").forEach(button => {
  button.addEventListener("click", () => addDifficulty(parseFloat(button.dataset.value)));
});

document.getElementById("btn-A").addEventListener("click", markLastAsA);
undoButton.addEventListener("click", () => {
  const item = difficulties.pop();
  if (item && item.isA) aCount -= 1;
  render();
});

document.getElementById("mode-junior").addEventListener("click", event => {
  maxDA = 12;
  document.getElementById("mode-senior").classList.remove("active");
  event.currentTarget.classList.add("active");
  render();
});
document.getElementById("mode-senior").addEventListener("click", event => {
  maxDA = 15;
  document.getElementById("mode-junior").classList.remove("active");
  event.currentTarget.classList.add("active");
  render();
});

document.getElementById("btn-validate").addEventListener("click", () => {
  const total = totalDA();
  setText("modal-score-big", formatScore(total));
  openModal("modal-backdrop");
});

document.getElementById("btn-restart").addEventListener("click", () => {
  difficulties = [];
  aCount = 0;
  closeModal("modal-backdrop");
  render();
});

render();
