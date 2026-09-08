# 05 — Accessibility: アクセシビリティ仕様

透明な素材は、定義上つねに可読性と交換条件にある。このシステムでは
アクセシビリティは「対応項目」ではなく素材仕様の一部である（縮退3層は
[01-material.md](01-material.md) 参照）。

## 3つのメディアクエリ（実装済み・必須維持)

| クエリ | 挙動 |
|---|---|
| `prefers-reduced-transparency` | 全ガラスを surface 連動の不透明面（opaque モード）に固化 |
| `prefers-contrast: more` | face 濃度を上げ、ink のコントラストを引き上げ |
| `prefers-reduced-motion` | 全アニメ停止。バネはスナップ、背景ドリフト・ヘイズ停止 |

Apple の公式要求（Reduce Transparency / Increase Contrast / Reduce Motion への
カスタム要素の追従）の Web 等価。**新しい部品・テーマでもこの3系統の動作確認を
してから出荷する。**

## コントラスト保証の構造

- ガラス上ラベルは `--lg-ink`（surface 連動のモノクローム）のみ。
  任意の色のテキストをガラスに置かない
- Regular: `--lg-bcomp`（輝度補償）が背景とラベルの分離を下支えする
- Clear: 適応を持たない代わりに、明 surface では 35% dim 層が自動で敷かれる。
  **dim を外す改造はコントラスト保証を外す改造**である
- 目標値: ガラス上の本文・ラベルは WCAG AA（4.5:1）。一瞥要素（アイコン等）でも
  3:1 を下回らない。背景が予測不能な場合は surface 宣言を疑うこと

## フォーカスと操作

- 全部品に `:focus-visible` リング定義済み（`--lg-ref-size-focus-*`）。
  リングはガラスの光と別系統で、常に最前面・高コントラスト
- gel はポインタと**キーボード（Enter/Space）**の両方で駆動される
- モーダル: Esc で閉じる・`aria-modal`・scrim クリックで閉じる、実装済み
- タブは `aria-selected` で状態を持つ（見た目のピルだけに頼らない）

## 検査手順（出荷前チェックリスト）

1. headless Chrome で console エラー 0
2. `prefers-reduced-transparency` エミュレーションで全画面が不透明面に落ちること
3. `prefers-reduced-motion` でバネ・背景・ヘイズが全停止すること
4. 各 surface（light/dark/media/text）× Regular/Clear でラベルのコントラスト実測
5. キーボードのみで全操作（Tab 巡回 → focus リング視認 → Enter/Space で押下）
