let daTotal = 0;
let daMax = 0;
let lastValue = null;

function updateDaDisplay() {
  document.getElementById("da-score").textContent = formatScore(daTotal);
  document.getElementById("da-max").textContent = formatScore(daMax);
}

document.querySelectorAll("[data-da]").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = parseFloat(btn.dataset.da);
    lastValue = value;
    daTotal += value;
    if (value > daMax) daMax = value;
    document.getElementById("da-current").textContent = `Selected: ${formatScore(value)}`;
    appendHistory("da-history", `+${formatScore(value)} DA`);
    updateDaDisplay();
  });
});

document.getElementById("da-undo").addEventListener("click", () => {
  if (lastValue === null) return;
  daTotal -= lastValue;
  appendHistory("da-history", `Undo ${formatScore(lastValue)} DA`);
  lastValue = null;
  document.getElementById("da-current").textContent = "No element selected";
  updateDaDisplay();
});

document.getElementById("da-reset").addEventListener("click", () => {
  daTotal = 0;
  daMax = 0;
  lastValue = null;
  document.getElementById("da-current").textContent = "No element selected";
  document.getElementById("da-history").innerHTML = "";
  updateDaDisplay();
});

document.getElementById("da-confirm").addEventListener("click", () => {
  closeModal("da-modal");
  appendHistory("da-history", `Inserted final DA: ${formatScore(daTotal)}`);
});

document.getElementById("da-send").addEventListener("click", () => {
  appendHistory("da-history", `SEND → ${formatScore(daTotal)} (Final DA)`);
});
