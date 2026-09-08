# Breadcrumbs — 使用用途

**層**: 塗り　**ガラス予算**: 予算外

## いつ使う
- 階層の現在地表示（detail / edit の page-header 先頭）

## いつ使わない（代替）
- 階層が1段しかない画面（不要）

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- 現在地は `aria-current="page"`（リンクにしない）

## 組み合わせ
- page-header 内、h1 の直上

## a11y
- nav[aria-label="breadcrumbs"] で包む

## AI への指示
- 3階層まで。深い場合は中間を省略（… ）してよい
