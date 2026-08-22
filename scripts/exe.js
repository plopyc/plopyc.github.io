const deductions = [];
const undoButton = document.getElementById("btn-undo");

function totalPenalty() {
  return deductions.reduce((sum, value) => sum + value, 0);
}

function render() {
  const total = totalPenalty();
  setText("total-penalty", formatScore(total, 1));
  setText("execution-score", formatScore(Math.max(0, 10 - total), 1));
  undoButton.disabled = deductions.length === 0;

  const history = document.getElementById("history");
  history.replaceChildren();
  deductions.forEach(value => appendHistory("history", `-${formatScore(value, 1)}`));
}

document.querySelectorAll("[data-value]").forEach(button => {
  button.addEventListener("click", () => {
    deductions.push(parseFloat(button.dataset.value));
    render();
  });
});

undoButton.addEventListener("click", () => {
  deductions.pop();
  render();
});

document.getElementById("btn-validate").addEventListener("click", () => {
  const total = totalPenalty();
  setText("modal-total", `Total Penalty: ${formatScore(total, 1)}`);
  setText("modal-score", `Execution Score: ${formatScore(Math.max(0, 10 - total), 1)}`);
  openModal("modal");
});

document.getElementById("btn-restart").addEventListener("click", () => {
  deductions.length = 0;
  closeModal("modal");
  render();
});

render();
