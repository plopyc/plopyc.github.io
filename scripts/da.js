let daTotal = 4.10; // initial example, you can set to 0
let daCount = 8;    // example starting index

const daScoreEl = document.getElementById("da-score");
const daHistoryEl = document.getElementById("da-history");

function updateDaScore() {
  daScoreEl.textContent = formatScore(daTotal);
}

document.querySelectorAll("[data-da]").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = parseFloat(btn.dataset.da);
    daTotal += value;
    updateDaScore();

    daCount += 1;
    const label = `#${daCount} DA ${formatScore(value)} COUNTED`;
    appendHistory("da-history", label);
  });
});

document.getElementById("da-undo").addEventListener("click", () => {
  // simple undo: remove last history item and subtract last value if stored
  const items = daHistoryEl.querySelectorAll(".history-item");
  if (!items.length) return;
  const last = items[items.length - 1];
  const text = last.textContent;
  const match = text.match(/DA ([0-9]+\.[0-9]+)/);
  if (match) {
    const val = parseFloat(match[1]);
    daTotal -= val;
    updateDaScore();
  }
  last.remove();
});

document.getElementById("da-validate").addEventListener("click", () => {
  document.getElementById("da-final-score").textContent = formatScore(daTotal);
  openModal("da-final-modal");
});

document.getElementById("da-confirm-final").addEventListener("click", () => {
  appendHistory("da-history", `Final DA validated: ${formatScore(daTotal)}`);
  closeModal("da-final-modal");
});

updateDaScore();
