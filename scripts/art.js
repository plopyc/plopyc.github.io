(() => {
  const live = {
    connections: 0,
    rhythm: 0,
    interruption: 0,
    danceSteps: 0,
    dynamic: 0
  };

  const penalties = {
    central: 0,
    physical: 0,
    facial: 0,
    space: 0,
    introduction: 0,
    ending: 0,
    standards: 0
  };

  const liveHistory = [];
  const finalHistory = [];
  const $ = (id) => document.getElementById(id);

  const total = () =>
    live.connections +
    live.rhythm +
    live.interruption +
    Math.max(0, 2 - live.danceSteps) * 0.3 +
    Math.max(0, 2 - live.dynamic) * 0.3 +
    Object.values(penalties).reduce((sum, value) => sum + value, 0);

  const score = () => Math.max(0, 10 - total());

  function snapshot(object) {
    return JSON.parse(JSON.stringify(object));
  }

  function updateScore() {
    $("live-deductions").textContent = total().toFixed(1);
    $("live-score").textContent = score().toFixed(1);
    $("final-deductions").textContent = total().toFixed(1);
    $("final-score").textContent = score().toFixed(1);
  }

  function updateLive() {
    $("connections-value").textContent = live.connections.toFixed(1);
    $("rhythm-value").textContent = live.rhythm.toFixed(1);
    $("interruption-value").textContent = live.interruption.toFixed(1);
    $("dance-steps-value").textContent = live.danceSteps;
    $("dynamic-value").textContent = live.dynamic;
    $("btn-interruption").disabled = live.interruption > 0;
    $("btn-undo-live").disabled = liveHistory.length === 0;

    const history = $("action-history");
    history.innerHTML = "";

    if (!liveHistory.length) {
      history.innerHTML = "<li class=\"empty-history\">No actions yet</li>";
      return;
    }

    liveHistory.forEach(({ label }) => {
      const item = document.createElement("li");
      item.textContent = label;
      history.appendChild(item);
    });
  }

  function recordLive(label, change) {
    liveHistory.push({ state: snapshot(live), label });
    change();
    updateLive();
    updateScore();
  }

  $("btn-connections").addEventListener("click", () => {
    if (live.connections < 2) {
      recordLive("Connection penalty: 0.1", () => { live.connections += 0.1; });
    }
  });

  $("btn-rhythm").addEventListener("click", () => {
    if (live.rhythm < 2) {
      recordLive("Rhythm penalty: 0.1", () => { live.rhythm += 0.1; });
    }
  });

  $("btn-interruption").addEventListener("click", () => {
    if (!live.interruption) {
      recordLive("Interruption penalty: 0.6", () => { live.interruption = 0.6; });
    }
  });

  $("btn-dance-step").addEventListener("click", () => {
    recordLive("Dance step recorded", () => { live.danceSteps += 1; });
  });

  $("btn-dynamic").addEventListener("click", () => {
    recordLive("Dynamic change recorded", () => { live.dynamic += 1; });
  });

  $("btn-undo-live").addEventListener("click", () => {
    const previous = liveHistory.pop();
    if (!previous) return;
    Object.assign(live, previous.state);
    updateLive();
    updateScore();
  });

  $("btn-complete").addEventListener("click", () => {
    $("live-step").classList.add("is-hidden");
    $("final-step").classList.remove("is-hidden");
    updateScore();
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      const value = Number(button.dataset.penalty);

      finalHistory.push({
        penalties: snapshot(penalties),
        category,
        button
      });

      penalties[category] = value;

      document
        .querySelectorAll(`[data-category="${category}"]`)
        .forEach((item) => item.classList.toggle("selected", item === button));

      $("btn-undo-final").disabled = false;
      updateScore();
    });
  });

  $("btn-undo-final").addEventListener("click", () => {
    const previous = finalHistory.pop();
    if (!previous) return;

    Object.assign(penalties, previous.penalties);
    document.querySelectorAll("[data-category]").forEach((button) => {
      button.classList.toggle(
        "selected",
        Number(button.dataset.penalty) === penalties[button.dataset.category]
      );
    });

    $("btn-undo-final").disabled = finalHistory.length === 0;
    updateScore();
  });

  document.querySelectorAll("[data-cancel]").forEach((button) => {
    button.addEventListener("click", () => {
      window.location.reload();
    });
  });

  updateLive();
  updateScore();
})();