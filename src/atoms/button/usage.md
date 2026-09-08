# Button — 使用用途

**層**: ガラス（tinted 既定）/ solid・outline・quiet は塗り（非ガラス）　**ガラス予算**: 同一コンテナ内のボタン群は合計1枚と数える

## いつ使う
- ユーザーの明示的な操作（実行・遷移・確定）
- 様式×意味色の2軸マトリクスから選ぶ（強い順: solid > tinted > outline > quiet）

## いつ使わない（代替）
- ナビゲーションのタブ的な切替 → nav / segmented
- ページ内リンクの羅列 → テキストリンク（lp-docs 型の塗りピル）
- 選択状態のトグル → chip（aria-pressed）/ switch

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- `--primary`（= `--accent`）は**1画面1箇所**。status 色は状態通知のみ・乱用禁止
- `.is-loading` はスピナーのみ表示（寸法維持）。`disabled` は減光+操作停止
- gel は `data-lg-gel`。アンカー（`<a>`）でも使用可（下線は自動で消える）
- lens モードでは押下時に**屈折自体が潰れる**（応答する光学・自動）

## 組み合わせ
- 破壊確定 = `--solid --danger`、静かな破壊導線 = `--outline --danger`
- モーダル/ドロワー内の従属 = `--quiet`（キャンセル）+ `--solid ×tone`（確定）
- 禁止: ガラス上に `.lg-glass` ボタン（glass on glass）→ 塗り様式を使う

## a11y
- ラベルは動詞で。アイコンのみなら `aria-label` 必須
- loading 中もラベルテキストは DOM に残す（SR 用）

## AI への指示
- まず意味色を決め（中立/主/危険/注意/成功）、次に強度を決める
- 1画面に solid と primary を並べない。主判断は1つに絞る
