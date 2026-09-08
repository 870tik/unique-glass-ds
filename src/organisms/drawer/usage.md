# Drawer / Sheet — 使用用途

**層**: ガラス（一時面）+ scrim　**ガラス予算**: 予算外

## いつ使う
- 文脈を保ったままの副作業（設定編集・詳細プレビュー・フィルタ群）

## いつ使わない（代替）
- 短い確認 → modal
- 主要な編集フロー → 編集画面（layout-form）

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- 右から translateX バネ入場。`LiquidGlass.drawer(backdrop)` / 自動配線 `_lgDrawer`

## 組み合わせ
- 内部は drawer-head + form-row 群 + actionbar が定型。入力は `--fill` 相

## a11y
- role=dialog + labelledby。Esc で閉じる（自動）

## AI への指示
- ドロワー内からさらにモーダルを開かない（一時面の多段は1段まで）
