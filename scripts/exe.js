let exePenalty = 1.90; // initial example, adjust as needed
const exePenaltyEl = document.getElementById("exe-penalty");
const exeHistoryEl = document.getElementById("exe-history");

function updateExePenalty() {
  exePenaltyEl.textContent = formatScore(exePenalty);
}

document.querySelectorAll("[data-ded]").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = parseFloat(btn.dataset.ded);
    exePenalty += value;
    updateExePenalty();
    appendHistory("exe-history", `-${formatScore(value)}`);
  });
});

document.getElementById("exe-undo").addEventListener("click", () => {
  const items = exeHistoryEl.querySelectorAll(".history-item");
  if (!items.length) return;
  const last = items[items.length - 1];
  const text = last.textContent;
  const match = text.match(/-([0-9]+\.[0-9]+)/);
  if (match) {
    const val = parseFloat(match[1]);
    exePenalty -= val;
    updateExePenalty();
  }
  last.remove();
});

document.getElementById("exe-validate").addEventListener("click", () => {
  document.getElementById("exe-final-score").textContent = formatScore(exePenalty);
  openModal("exe-final-modal");
});

document.getElementById("exe-confirm-final").addEventListener("click", () => {
  appendHistory("exe-history", `Final penalty validated: ${formatScore(exePenalty)}`);
  closeModal("exe-final-modal");
});

updateExePenalty();
