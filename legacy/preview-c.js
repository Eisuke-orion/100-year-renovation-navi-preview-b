"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#article-search");
  if (input) input.addEventListener("input", () => {
    const value = input.value.trim().toLocaleLowerCase("ja");
    let visible = 0;
    document.querySelectorAll(".c-card").forEach(card => {
      card.hidden = !card.dataset.search.toLocaleLowerCase("ja").includes(value);
      if (!card.hidden) visible++;
    });
    document.querySelector("#search-count").textContent = `${visible}件を表示`;
    document.querySelector("#search-empty").hidden = visible !== 0;
  });
  const reveal = hash => {
    if (!/^#source-\d+$/.test(hash)) return;
    const target = document.querySelector(hash);
    if (!target) return;
    target.closest("details").open = true;
  };
  document.querySelectorAll(".c-ref").forEach(link => link.addEventListener("click", () => reveal(link.hash)));
  reveal(location.hash);
  window.addEventListener("hashchange", () => reveal(location.hash));
});
