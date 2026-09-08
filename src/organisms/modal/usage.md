# Modal — 使用用途

**層**: ガラス（一時面）+ scrim　**ガラス予算**: 予算外

## いつ使う
- 進行を止めて確認・小さな入力を取る（削除確認・名称変更）

## いつ使わない（代替）
- 大きな編集 → drawer か編集画面へ遷移
- 結果通知 → toast

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- `LiquidGlass.modal(backdrop)` で配線（Esc・scrim クリック・focus 復帰）。pane に tabindex=-1

## 組み合わせ
- 確定は `--solid ×tone`、退路は `--quiet`。破壊確認は文言に対象名を含める

## a11y
- aria-modal/labelledby 必須。開いたら pane にフォーカス（自動）

## AI への指示
- ボタンは2つまで。「キャンセル」を左、確定を右
