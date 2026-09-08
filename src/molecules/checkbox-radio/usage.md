# Checkbox / Radio — 使用用途

**層**: 塗り → 押下中のみ発光（transient）　**ガラス予算**: 予算外

## いつ使う
- checkbox: 複数選択・同意。radio: 2〜5個の排他選択

## いつ使わない（代替）
- 即時反映のトグル → switch
- 排他が6個以上 → select

## 契約の要点
- マークアップ正典: 同フォルダの `.html`
- `.lg-check-box` が描画体。checked 状態は input が実体

## 組み合わせ
- form-row 内で縦積み（radio は name を揃える）

## a11y
- グループには fieldset/legend 相当のラベルを付ける

## AI への指示
- 既定 checked は法的・課金に関わる項目では使わない
