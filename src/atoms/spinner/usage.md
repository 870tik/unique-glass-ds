# Spinner — 使用用途

**層**: コンテンツ層　**ガラス予算**: —

## いつ使う
- 不定時間の読み込み表示（領域用）。ボタン内は `.is-loading` を使う

## いつ使わない（代替）
- 進捗が測れる処理 → progress（determinate）
- コンテンツ待ちの骨格 → skeleton

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- `role="status"` + `aria-label`。reduced-motion では回転が減速

## 組み合わせ
- empty-state の代わりに使わない（待ちと空は別状態）

## a11y
- 長時間続くなら進捗テキストを併記

## AI への指示
- 3秒超が見込まれる処理は skeleton か progress に切り替える
