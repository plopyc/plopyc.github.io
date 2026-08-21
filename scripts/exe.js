let exePenalty = 0;
let exeBase = 10;
let lastDeduction = null;

function updateExeDisplay() {
  document.getElementById("exe-penalty").textContent = formatScore(exePenalty);
  const score = exeBase - exePenalty;
  document.getElementById("exe-score").textContent = formatScore(Math.max(score, 0));
}

document.querySelectorAll("[data-ded]").forEach(btn => {
  btn.addEventListener("click", () => {
    const value = parseFloat(btn.dataset.ded);
    lastDeduction = value;
    exePenalty += value;
    document.getElementById("exe-current").textContent = `Applied: -${formatScore(value)}`;
    appendHistory("exe-history", `-${formatScore(value)} penalty`);
    updateExeDisplay();
  });
});

document.getElementById("exe-undo").addEventListener("click", () => {
  if (lastDeduction === null) return;
  exePenalty -= lastDeduction;
  appendHistory("exe-history", `Undo -${formatScore(lastDeduction)}`);
  lastDeduction = null;
  document.getElementById("exe-current").textContent = "No deduction applied";
  updateExeDisplay();
});

document.getElementById("exe-reset").addEventListener("click", () => {
  exePenalty = 0;
  lastDeduction = null;
  document.getElementById("exe-current").textContent = "No deduction applied";
  document.getElementById("exe-history").innerHTML = "";
  updateExeDisplay();
});

document.getElementById("exe-confirm").addEventListener("click", () => {
  closeModal("exe-modal");
  appendHistory("exe-history", `Inserted penalty: ${formatScore(exePenalty)}`);
});

document.getElementById("exe-send").addEventListener("click", () => {
  const score = exeBase - exePenalty;
  appendHistory("exe-history", `SEND → ${formatScore(Math.max(score, 0))} (E1 score)`);
});
