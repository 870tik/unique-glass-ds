# Dropzone — 使用用途

**層**: コンテンツ層 → **drag over の間だけガラス化**　**ガラス予算**: 予算外

## いつ使う
- ファイル添付（複数可）。クリックでも選択可

## いつ使わない（代替）
- 単一の小さな添付 → button + file input で足りる場合

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- `lg-files` CustomEvent でファイル受取。`.files` に名前が出る

## 組み合わせ
- form-layout 内。アップロード進捗は progress を併設

## a11y
- tabindex/role=button 自動。Enter/Space で選択ダイアログ

## AI への指示
- 受理形式と上限サイズをゾーン内テキストに明記させる
