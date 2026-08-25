"use strict";

// support.js が本文DOMを置き換えた後も、既存 common.js と競合せずに
// グローバルメニューを操作するためのコラム専用イベント委譲です。
(() => {
  if (window.__columnNavControllerInstalled) return;
  window.__columnNavControllerInstalled = true;

  const navElement = () => document.querySelector("nav.site-global-nav, #site-global-nav, nav:not(.column-breadcrumb):not(.column-pagination)");

  function setOpen(open) {
    const nav = navElement();
    if (!nav) return;
    nav.style.display = open ? "block" : "none";
    nav.setAttribute("aria-hidden", open ? "false" : "true");
    document.querySelectorAll(".nav_open").forEach((button) => button.setAttribute("aria-expanded", open ? "true" : "false"));
    document.body.classList.toggle("site-nav-open", open);
  }

  function stop(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest(".nav_open")) {
      stop(event);
      setOpen(true);
      return;
    }
    if (target.closest("nav .nav_close, nav .nav_header") || target === navElement()) {
      stop(event);
      setOpen(false);
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if ((event.key === "Enter" || event.key === " ") && target?.closest(".nav_open")) {
      stop(event);
      setOpen(true);
    } else if ((event.key === "Enter" || event.key === " ") && target?.closest("nav .nav_close")) {
      stop(event);
      setOpen(false);
    } else if (event.key === "Escape" && navElement()?.getAttribute("aria-hidden") === "false") {
      stop(event);
      setOpen(false);
    }
  }, true);
})();
