window.addEventListener("pageshow", (e) => {
  if (e.persisted || window.performance && window.performance.getEntriesByType
      && String(window.performance.getEntriesByType("navigation")[0].type) === "back_forward") {
          window.location.reload();
      }
});