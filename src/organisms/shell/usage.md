# Shell (Sidebar / Topbar) — 使用用途

**層**: ガラス（恒常クローム。**合計1枚**として予算計上）　**ガラス予算**: sidebar+topbar = 1枚

## いつ使う
- アプリ全画面の骨格。sidebar(thick) = 主要ナビ、topbar(thin) = 現在地と横断操作

## いつ使わない（代替）
- LP・認証・集中作業 → shell を使わない（lp-nav / focus / auth）

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- md(900px) でサイドバーはオフキャンバス化（menu-btn・scrim・Esc 自動）
- **ガラス上の入力は `--fill` 相**（glass on glass 禁止）

## 組み合わせ
- content 領域には必ず `.lg-page` を置く

## a11y
- サイドバーは nav[aria-label]。トグルに aria-label

## AI への指示
- topbar には現在地 + 検索 + 3個までの icon-button に抑える
