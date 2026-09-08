# Progress — 使用用途

**層**: コンテンツ層　**ガラス予算**: —

## いつ使う
- 進捗が測れる処理（determinate: data-lg-value）/ 測れないが継続中（.is-indeterminate）

## いつ使わない（代替）
- 瞬時に終わる処理（出さない）
- 骨格が見せられる読込 → skeleton

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- `LiquidGlass.progress(el, v)` で更新。aria-valuenow 自動

## 組み合わせ
- アップロード・エクスポートの panel 内

## a11y
- 近くに％または残り件数のテキスト併記を推奨

## AI への指示
- indeterminate を10秒以上続けない（体感が破綻する）
