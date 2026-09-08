# Icon — 使用用途

**層**: —（描画ユーティリティ）　**ガラス予算**: —

## いつ使う
- `<i data-lg-icon="name">` で Lucide sprite から描画（js/lg-icons.js が必要）
- サイズは標準15px / `.lg-icon--lg` 18px の2段のみ

## いつ使わない（代替）
- 装飾目的の多用。アイコンは操作・分類の手掛かりに限る
- 他アイコンセットの混入（線の語彙が濁る）

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- 色は常に currentColor（親の ink に追従）。線幅 1.5px 固定
- 追加は assets/icons/ に SVG → `node tools/build-icons.mjs`

## 組み合わせ
- icon-button / field の affix / empty-state / door-head で使用

## a11y
- 単独では `aria-hidden`。意味を持つ場合は親に `aria-label`

## AI への指示
- 一覧は catalog.html の Foundation ストーリー。名前は LGIcons.names で取得可
