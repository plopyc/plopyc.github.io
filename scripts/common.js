function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("open");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("open");
}

function formatScore(value, decimals = 2) {
  return Number(value).toFixed(decimals);
}

function appendHistory(listId, text, className = "history-item") {
  const list = document.getElementById(listId);
  if (!list) return;
  const item = document.createElement("div");
  item.className = className;
  item.textContent = text;
  list.appendChild(item);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}
