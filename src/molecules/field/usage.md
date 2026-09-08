# Field — 使用用途

**層**: ガラス（transient: rest 85% → focus 100%）。ガラス上では `--fill`（塗り・.lg-glass 併用禁止）　**ガラス予算**: 予算外（入力は操作子扱い）

## いつ使う
- 単一行テキスト・検索・URL 等の入力
- 拡張: `--multi`（textarea + data-lg-autosize）/ affix（前後アイコン）/ `--number`

## いつ使わない（代替）
- 選択肢からの入力 → select / combobox / datepicker
- ガラス（topbar 等）の上 → `--fill` 相に切替（glass on glass 禁止）

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- 状態: `.is-error`（赤リング+状態光学）/ `.is-warning` / `.is-success` / disabled 自動減光
- ラベル・ヘルプは form-row 側の責務

## 組み合わせ
- form-row と常にセット。単体裸置きは検索など文脈が自明な場合のみ

## a11y
- input に aria-label か label for を必ず。エラーは色+文言の二重化

## AI への指示
- 幅は内容量で決める（日付 220px・名前 320px 目安）。全幅は form-layout 内のみ
