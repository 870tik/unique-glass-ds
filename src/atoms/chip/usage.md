# Chip — 使用用途

**層**: 塗り　**ガラス予算**: 予算外

## いつ使う
- フィルタ・タグの**トグル**（aria-pressed で選択状態）

## いつ使わない（代替）
- 単発の実行 → button
- 排他選択 → segmented / radio

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- `aria-pressed` が状態。選択で ink 反転（自動配線）

## 組み合わせ
- toolbar 内でフィルタ群として並べる（複数選択可の意味）

## a11y
- 選択状態は aria-pressed が担う（見た目のみにしない）

## AI への指示
- 3〜6個が適量。増えるなら select / combobox へ
