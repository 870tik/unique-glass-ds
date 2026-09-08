# Nav (Tab bar) — 使用用途

**層**: ガラス（Regular。media 上のみ Clear 可）　**ガラス予算**: 予算内1枚

## いつ使う
- 画面上部のタブ切替。縦型 `--vertical` はサイドバー内

## いつ使わない（代替）
- 2〜5個の設定的切替 → segmented
- 外部ページへの遷移群 → 塗りリンク

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- ピル自動生成・gel 滑走。`aria-controls` でパネル自動結合（hidden/role 管理）

## 組み合わせ
- shell の sidebar 内（縦）・コンテンツ上部（横）

## a11y
- aria-selected 自動。タブラベルは1〜2語

## AI への指示
- タブ数7超なら情報設計を見直す（sidebar 階層化 or 統合）
