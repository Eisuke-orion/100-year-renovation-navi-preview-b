"use strict";

// 通常運用では mode を auto のまま使用します。
// 管理会社側で公開状態を固定確認するときだけ mode を manual にし、
// publishedThrough に確認したい回数（1〜20）を指定してください。
window.ColumnPublicationConfig = Object.freeze({
  mode: "auto",
  publishedThrough: null,
  maxRelated: 4,
  previewHosts: [
    "bl.cabokobtest.site",
    "www.bl.cabokobtest.site",
  ],
});
