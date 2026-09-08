# Toast — 使用用途

**層**: ガラス（一時面）　**ガラス予算**: 予算外

## いつ使う
- 操作の**結果**通知（保存した・削除した）。Undo 添付可

## いつ使わない（代替）
- ユーザーの確認が必要 → modal
- 留まるべき情報 → banner

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- JS API のみ: `LiquidGlass.toast(msg,{action,onAction,positive,sticky})`。右下スタック上限4・hover 滞留

## 組み合わせ
- 破壊操作の完了 + Undo が黄金パターン

## a11y
- role=status/aria-live=polite（自動）。重要確認に使わない

## AI への指示
- 文は結果の報告形「〜しました」。疑問形・依頼形は禁止
