"use strict";

(() => {
  const publicationDates = Object.freeze({
    "column-01.dc.html": "2026-08-10",
    "column-02.dc.html": "2026-08-18",
    "column-03.dc.html": "2026-08-20",
    "column-04.dc.html": "2026-08-25",
    "column-05.dc.html": "2026-08-27",
    "column-06.dc.html": "2026-09-01",
    "column-07.dc.html": "2026-09-03",
    "column-08.dc.html": "2026-09-08",
    "column-09.dc.html": "2026-09-10",
    "column-10.dc.html": "2026-09-15",
    "column-11.dc.html": "2026-09-17",
    "column-12.dc.html": "2026-09-22",
    "column-13.dc.html": "2026-09-24",
    "column-14.dc.html": "2026-09-29",
    "column-15.dc.html": "2026-10-01",
    "column-16.dc.html": "2026-10-06",
    "column-17.dc.html": "2026-10-08",
    "column-18.dc.html": "2026-10-13",
    "column-19.dc.html": "2026-10-15",
    "column-20.dc.html": "2026-10-20",
  });

  const previewParameter = "publication-preview-date";
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  function dateInJapan(date = new Date()) {
    const values = {};
    for (const part of new Intl.DateTimeFormat("en", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date)) {
      if (part.type !== "literal") values[part.type] = part.value;
    }
    return `${values.year}-${values.month}-${values.day}`;
  }

  function validIsoDate(value) {
    if (!isoDatePattern.test(value || "")) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }

  function previewDate() {
    const host = window.location.hostname;
    const canPreview = host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".github.io");
    if (!canPreview) return null;
    const value = new URLSearchParams(window.location.search).get(previewParameter);
    return validIsoDate(value) ? value : null;
  }

  function articleFile(href) {
    try {
      const pathname = new URL(href, window.location.href).pathname;
      return decodeURIComponent(pathname.split("/").pop() || "");
    } catch {
      return "";
    }
  }

  function isPublished(href, asOf = previewDate() || dateInJapan()) {
    const publishedAt = publicationDates[articleFile(href)];
    return typeof publishedAt === "string" && publishedAt <= asOf;
  }

  function displayDate(article) {
    const value = publicationDates[article];
    if (!value) return "調整中";
    const [year, month, day] = value.split("-").map(Number);
    return `${year}年${month}月${day}日`;
  }

  function applyRelatedArticleVisibility(root = document, asOf = previewDate() || dateInJapan()) {
    const sections = root.querySelectorAll?.("[data-related-articles]") || [];
    let visibleLinks = 0;

    for (const section of sections) {
      let visibleInSection = 0;
      const parsedLimit = Number.parseInt(section.dataset.relatedLimit || "", 10);
      const linkLimit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : Number.POSITIVE_INFINITY;
      for (const link of section.querySelectorAll("a[href]")) {
        const visible = isPublished(link.getAttribute("href"), asOf) && visibleInSection < linkLimit;
        link.hidden = !visible;
        if (visible) {
          link.removeAttribute("aria-hidden");
          visibleInSection += 1;
        } else {
          link.setAttribute("aria-hidden", "true");
        }
      }
      section.hidden = visibleInSection === 0;
      section.dataset.publicationAsOf = asOf;
      visibleLinks += visibleInSection;
    }

    return visibleLinks;
  }

  function start() {
    let refreshQueued = false;
    const refresh = () => {
      if (refreshQueued) return;
      refreshQueued = true;
      queueMicrotask(() => {
        refreshQueued = false;
        applyRelatedArticleVisibility();
      });
    };

    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("pageshow", refresh);
  }

  window.ColumnPublication = Object.freeze({
    dates: publicationDates,
    displayDate,
    isPublished,
    applyRelatedArticleVisibility,
    dateInJapan,
    previewParameter,
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
