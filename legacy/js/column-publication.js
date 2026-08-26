"use strict";

(() => {
  const articles = Object.freeze([
    { episode: 1, file: "column-01.dc.html", title: "家は資産か、負債か。暮らしから考える住まいの価値", publishDate: "2026-08-10", related: [2, 3, 4, 5, 6, 7, 8, 9] },
    { episode: 2, file: "column-02.dc.html", title: "片づかないのは、あなたのせいじゃない。収納と動線で変わる家", publishDate: "2026-08-18", related: [7, 3, 1, 4, 5, 6, 8, 9] },
    { episode: 3, file: "column-03.dc.html", title: "家族の気配が通う家。子どもと暮らす住まいの考え方", publishDate: "2026-08-20", related: [1, 2, 4, 9, 6, 7, 8, 5] },
    { episode: 4, file: "column-04.dc.html", title: "実家じまいは、親が元気なうちに。家族で考えるこれからの住まい", publishDate: "2026-08-25", related: [5, 1, 3, 7, 9, 2, 6, 8] },
    { episode: 5, file: "column-05.dc.html", title: "マンションの老いにどう備えるか。長く暮らすための住まいの条件", publishDate: "2026-08-27", related: [7, 4, 1, 6, 8, 2, 3, 9] },
    { episode: 6, file: "column-06.dc.html", title: "「夏をむねとすべし」は今も正解？一年を通じて快適な家", publishDate: "2026-09-01", related: [8, 4, 3, 7, 1, 2, 5, 9] },
    { episode: 7, file: "column-07.dc.html", title: "リフォームで失敗しないために。見積もりと業者選びの基本", publishDate: "2026-09-03", related: [6, 4, 2, 5, 8, 1, 3, 9] },
    { episode: 8, file: "column-08.dc.html", title: "電気代が高く感じられる理由。窓と家電から始める節電", publishDate: "2026-09-08", related: [6, 7, 1, 9, 5, 2, 3, 4] },
    { episode: 9, file: "column-09.dc.html", title: "台風の前に、家族で決めておくこと。家の外・中・避難の備え", publishDate: "2026-09-10", related: [7, 4, 3, 6, 8, 1, 2, 5] },
    { episode: 10, file: "column-10.dc.html", title: "子どもが巣立ったあと、家はどう変える？──50代から考える夫婦の居場所", publishDate: "2026-09-15", related: [1, 2, 3, 19] },
    { episode: 11, file: "column-11.dc.html", title: "50代人口の約3割に達するNISA口座。住宅ローンが残るなら、何を優先する？", publishDate: "2026-09-17", related: [1, 2, 10, 12] },
    { episode: 12, file: "column-12.dc.html", title: "住宅ローンの変動金利が1％違うと、家計はどう変わる？", publishDate: "2026-09-22", related: [1, 2, 7, 11] },
    { episode: 13, file: "column-13.dc.html", title: "円安で、家はどう変わる？──住まいのコストと、これからできる備え", publishDate: "2026-09-24", related: [1, 2, 8, 12] },
    { episode: 14, file: "column-14.dc.html", title: "住まいの「音」を負担に感じたら。家族で整える音環境のポイント", publishDate: "2026-09-29", related: [1, 2, 3, 20] },
    { episode: 15, file: "column-15.dc.html", title: "家を持つ人のための相続の常識──「うちは大丈夫」と思う前に", publishDate: "2026-10-01", related: [1, 2, 4, 16] },
    { episode: 16, file: "column-16.dc.html", title: "実家じまいは、空っぽにすることじゃない──家族の記憶と、家の次の使い方を整える", publishDate: "2026-10-06", related: [1, 2, 4, 15] },
    { episode: 17, file: "column-17.dc.html", title: "住まいの悩みを生成AIで整理する──入力と得られる結果がわかる4つの使い方", publishDate: "2026-10-08", related: [1, 2, 7, 19] },
    { episode: 18, file: "column-18.dc.html", title: "地震直後、6避難所の調査で多かった困りごとはトイレ", publishDate: "2026-10-13", related: [1, 2, 9, 13] },
    { episode: 19, file: "column-19.dc.html", title: "家族が集まる場所は、リビングだけじゃない。成長に合わせて「つながり方」を変えられる家へ", publishDate: "2026-10-15", related: [1, 2, 3, 10] },
    { episode: 20, file: "column-20.dc.html", title: "その子の「安心ゾーン」は、家につくれる──発達特性のある子どもと家族を支える住まい", publishDate: "2026-10-20", related: [1, 2, 3, 14] },
  ]);
  const config = Object.freeze({ mode: "auto", publishedThrough: null, maxRelated: 4, previewHosts: [], ...(window.ColumnPublicationConfig || {}) });
  const articleByFile = new Map(articles.map((article) => [article.file, article]));
  const articleByEpisode = new Map(articles.map((article) => [article.episode, article]));
  const previewDateParameter = "publication-preview-date";
  const previewThroughParameter = "publication-preview-through";
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  function dateInJapan(date = new Date()) {
    const values = {};
    for (const part of new Intl.DateTimeFormat("en", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date)) {
      if (part.type !== "literal") values[part.type] = part.value;
    }
    return `${values.year}-${values.month}-${values.day}`;
  }
  function validIsoDate(value) {
    if (!isoDatePattern.test(value || "")) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }
  function validEpisode(value) {
    const episode = Number.parseInt(String(value || ""), 10);
    return Number.isInteger(episode) && episode >= 1 && episode <= articles.length ? episode : null;
  }
  function canPreview() {
    const host = window.location.hostname;
    const hosts = Array.isArray(config.previewHosts) ? config.previewHosts : [];
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".github.io") || hosts.includes(host);
  }
  function previewState() {
    if (!canPreview()) return { date: null, through: null };
    const parameters = new URLSearchParams(window.location.search);
    const date = parameters.get(previewDateParameter);
    return { date: validIsoDate(date) ? date : null, through: validEpisode(parameters.get(previewThroughParameter)) };
  }
  function articleFile(href) {
    try { return decodeURIComponent(new URL(href, window.location.href).pathname.split("/").pop() || ""); }
    catch { return ""; }
  }
  function configuredThrough() { return config.mode === "manual" ? validEpisode(config.publishedThrough) : null; }
  function activeThrough() { return previewState().through ?? configuredThrough(); }
  function activeDate() { return previewState().date || dateInJapan(); }
  function isPublished(href, asOf = activeDate()) {
    const article = articleByFile.get(articleFile(href));
    if (!article) return false;
    const through = activeThrough();
    return through === null ? article.publishDate <= asOf : article.episode <= through;
  }
  function displayDate(file) {
    const article = articleByFile.get(articleFile(file));
    if (!article) return "調整中";
    const [year, month, day] = article.publishDate.split("-").map(Number);
    return `${year}年${month}月${day}日`;
  }
  function previewQuery() {
    if (!canPreview()) return "";
    const source = new URLSearchParams(window.location.search);
    const result = new URLSearchParams();
    for (const name of [previewDateParameter, previewThroughParameter]) if (source.get(name)) result.set(name, source.get(name));
    return result.size ? `?${result}` : "";
  }
  function internalUrl(href) {
    const query = previewQuery();
    if (!query) return href;
    const url = new URL(href, window.location.href);
    for (const [name, value] of new URLSearchParams(query.slice(1))) url.searchParams.set(name, value);
    return `${url.pathname.split("/").pop()}${url.search}${url.hash}`;
  }
  function publishedArticles() { return articles.filter((article) => isPublished(article.file)); }
  function currentArticle(root = document) {
    const direct = articleByFile.get(articleFile(window.location.href));
    if (direct) return direct;

    // 管理会社側の検証環境では、記事HTMLが別URLへ組み込まれる場合があるため、
    // URLだけでなくcanonicalとパンくずからも現在回を特定する。
    const canonical = root.querySelector('link[rel="canonical"]')?.href;
    const canonicalArticle = canonical ? articleByFile.get(articleFile(canonical)) : null;
    if (canonicalArticle) return canonicalArticle;

    const currentLabel = root.querySelector('[aria-current="page"]')?.textContent || "";
    const episode = Number.parseInt(currentLabel.match(/第(\d+)回/)?.[1] || "", 10);
    return articleByEpisode.get(episode) || null;
  }
  function isFrozenBaselineArticle(article = currentArticle()) {
    return Boolean(article && article.episode >= 1 && article.episode <= 9);
  }
  function applyFrozenBaselineRelatedVisibility(root = document) {
    const sections = root.querySelectorAll?.("[data-related-articles]") || [];
    const asOf = activeDate();
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
    }
  }
  function relatedArticlesFor(current, limit) {
    return [...new Set(current.related)]
      .map((episode) => articleByEpisode.get(episode))
      .filter((article) => article && article.episode !== current.episode && isPublished(article.file))
      .sort((left, right) => right.episode - left.episode)
      .slice(0, limit);
  }
  function findAuthorBox(root) {
    for (const paragraph of root.querySelectorAll("p")) if (paragraph.textContent?.includes("この記事を書いた人")) return paragraph.closest("div[style]");
    return null;
  }
  function ensureRelatedSection(root = document) {
    const current = currentArticle();
    if (!current) return 0;
    const limit = Number.isInteger(Number(config.maxRelated)) && Number(config.maxRelated) > 0 ? Number(config.maxRelated) : 4;
    const related = relatedArticlesFor(current, limit);
    let section = root.querySelector("[data-related-articles]");
    if (!section) {
      const authorBox = findAuthorBox(root);
      if (!authorBox) return 0;
      section = document.createElement("section");
      section.dataset.relatedArticles = "";
      section.style.marginBottom = "44px";
      authorBox.before(section);
    }
    const signature = related.map((article) => article.episode).join(",");
    if (section.dataset.relatedSignature !== signature) {
      section.innerHTML = "";
      const heading = document.createElement("p");
      heading.textContent = "関連記事";
      heading.style.cssText = "font-family:'Zen Maru Gothic',sans-serif;font-weight:700;font-size:15px;margin:0 0 14px";
      const links = document.createElement("div");
      links.style.cssText = "display:flex;flex-direction:column;gap:10px;font-size:14.5px";
      for (const article of related) {
        const link = document.createElement("a");
        link.dataset.relatedEpisode = String(article.episode);
        link.href = internalUrl(article.file);
        link.textContent = `【第${article.episode}回】${article.title}`;
        links.append(link);
      }
      section.append(heading, links);
      section.dataset.relatedSignature = signature;
    }
    section.hidden = related.length === 0;
    section.dataset.relatedOrder = "descending";
    section.dataset.relatedCount = String(related.length);
    section.dataset.publicationAsOf = activeThrough() === null ? activeDate() : `episode-${activeThrough()}`;
    return related.length;
  }
  function applyPagination(root = document) {
    const current = currentArticle();
    const nav = root.querySelector("nav.column-pagination");
    if (!current || !nav || nav.dataset.publicationManaged === `${activeDate()}-${activeThrough()}`) return;
    const published = publishedArticles();
    const index = published.findIndex((article) => article.episode === current.episode);
    if (index < 0) return;
    const previous = published[index - 1] || null;
    const next = published[index + 1] || null;
    nav.innerHTML = "";
    const previousNode = previous ? document.createElement("a") : document.createElement("span");
    previousNode.textContent = "← 前の回";
    if (previous) previousNode.href = internalUrl(previous.file); else previousNode.style.color = "oklch(0.7 0.015 90)";
    const indexLink = document.createElement("a");
    indexLink.href = internalUrl("index.html");
    indexLink.textContent = "目次に戻る";
    indexLink.style.cssText = "font-family:'Zen Maru Gothic',sans-serif;font-weight:700";
    const nextNode = next ? document.createElement("a") : document.createElement("span");
    nextNode.textContent = next ? "次の回 →" : `第${current.episode}回が現在の最新回です`;
    if (next) nextNode.href = internalUrl(next.file); else nextNode.style.color = "oklch(0.62 0.015 90)";
    nav.append(previousNode, indexLink, nextNode);
    nav.dataset.publicationManaged = `${activeDate()}-${activeThrough()}`;
  }
  function renderUnpublishedPage(article) {
    document.title = "未公開の記事です";
    document.body.innerHTML = `<main style="font-family:'Noto Sans JP',sans-serif;max-width:720px;margin:0 auto;padding:64px 24px;line-height:1.9"><h1 style="font-size:28px">この回はまだ公開されていません</h1><p>第${article.episode}回は${displayDate(article.file)}に公開予定です。</p><p><a href="${internalUrl("index.html")}">公開済みの記事一覧へ戻る</a></p></main>`;
    document.documentElement.classList.remove("column-publication-pending");
  }
  function applyArticleVisibility() {
    const article = currentArticle();
    if (!article) { document.documentElement.classList.remove("column-publication-pending"); return true; }
    if (isFrozenBaselineArticle(article)) { document.documentElement.classList.remove("column-publication-pending"); return true; }
    if (!isPublished(article.file)) { renderUnpublishedPage(article); return false; }
    document.documentElement.classList.remove("column-publication-pending");
    return true;
  }
  function refresh() {
    if (!applyArticleVisibility()) return;
    if (isFrozenBaselineArticle()) {
      applyFrozenBaselineRelatedVisibility();
      return;
    }
    ensureRelatedSection();
    applyPagination();
  }
  function safeRefresh() {
    try { refresh(); }
    catch (error) {
      document.documentElement.classList.remove("column-publication-pending");
      console.error("[column-publication] 公開制御の更新に失敗しました", error);
    }
  }
  function start() {
    safeRefresh();
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => { queued = false; safeRefresh(); });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("pageshow", safeRefresh);
    window.addEventListener("load", safeRefresh, { once: true });

    // support.jsによる本文描画の完了時期が環境ごとに異なっても追従する。
    for (const delay of [50, 250, 1000, 2500]) window.setTimeout(safeRefresh, delay);
  }
  const current = currentArticle();
  if (current && !isFrozenBaselineArticle(current) && !isPublished(current.file)) {
    document.documentElement.classList.add("column-publication-pending");
    const style = document.createElement("style");
    style.textContent = "html.column-publication-pending body{visibility:hidden}";
    document.head.append(style);
  }
  window.ColumnPublication = Object.freeze({
    articles,
    dates: Object.freeze(Object.fromEntries(articles.map((article) => [article.file, article.publishDate]))),
    displayDate, isPublished, publishedArticles, internalUrl, ensureRelatedSection, applyPagination, dateInJapan,
    relatedArticlesFor, applyFrozenBaselineRelatedVisibility,
    previewDateParameter, previewThroughParameter,
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true }); else start();
})();
