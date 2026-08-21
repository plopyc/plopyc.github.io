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

function appendHistory(listId, text) {
  const list = document.getElementById(listId);
  if (!list) return;
  const item = document.createElement("div");
  item.className = "history-item";
  item.textContent = text;
  list.prepend(item);
}

function formatScore(value) {
  return value.toFixed(2);
}
