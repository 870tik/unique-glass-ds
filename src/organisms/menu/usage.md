# Menu — 使用用途

**層**: ガラス（一時面）　**ガラス予算**: 予算外

## いつ使う
- 行・要素に対する操作の束（⋯ から View/Duplicate/Delete）

## いつ使わない（代替）
- 単一操作 → button/icon-button 直置き
- フォーム内容 → popover

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- anchor + trigger + panel。バネ入場・矢印/Esc・外側クリック自動。`data-lg-align="right"`

## 組み合わせ
- 破壊項目は `.is-danger` + sep で分離して最下部

## a11y
- role=menu/menuitem 自動。トリガーに aria-label（アイコンのみ時）

## AI への指示
- 項目は7個まで。動詞始まりで統一
