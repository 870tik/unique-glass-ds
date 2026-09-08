# 08 — Usage Rules: トークンとコンポーネントの利用ルール

このシステムを「使う側」（ページ・画面・デモ・納品物を組む人と AI）が守るルール。
違反は `node tools/lint-usage.mjs` で機械検出できる。lint が通らない実装は
このシステムの実装ではない。

---

## A. トークン利用ルール

### A1. 参照方向（一方向のみ）

```
ref（生値）→ sys（素材レシピ）→ comp（部品契約）→ ページ/画面
                                  ↑
テーマ（上書きは ref 層のみ）──────┘
```

- **ページ/画面が参照してよいもの**:
  1. comp 層トークン（`--lg-button-*` 等）
  2. foundation の ref（`--lg-ref-space-*` / `--lg-ref-type-*` / `--lg-ref-z-*` /
     `--lg-ref-radius-*` / `--lg-ref-size-*` / `--lg-ref-color-chart-*`）
  3. adaptive の実効変数（`--lg-ink` / `--lg-rim` / `--lg-opaque-bg` 等 —
     surface が解決した値）
- **ページが参照してはいけないもの**: 色の ref 直参照（`--lg-ref-color-ink-dark`
  等）。色は必ず surface 経由（`--lg-ink`）で受ける。直参照した瞬間、その要素は
  surface 適応から脱落する
- **sys 層の書き換え禁止**: `--lg-material-*` / `--lg-light-*` / `--lg-adaptive-*` /
  `--lg-motion-*` をページで上書きしない。質感の変更はテーマ（ref 上書き）で行う

### A2. 直値の全面禁止と、3つの例外

色（hex/rgba）と寸法（px/em）の直書きは、コア CSS・ページ CSS・インライン
すべてで禁止。値が必要なら**トークンに追加してから使う**（`src/foundations/tokens/` か部品フォルダの tokens →
`node tools/build-tokens.mjs` → $description 必須）。

例外は3つだけ。いずれも明示が条件:

1. **構造定数** — ヘアライン(1px)・グリフ幾何（チェックマーク・シェブロンの
   数 px）・光学微調整の letter-spacing(≤0.08em)・`50%`/`100%` 等。
   コア CSS 内で行末に `/* lint: structural */` を付けたもののみ
2. **@media のブレークポイントリテラル** — CSS はカスタムプロパティを media
   query に使えないため、`--lg-ref-breakpoint-*` と同値のリテラルを書く。
   トークンが正。変更時は両方更新
3. **デモ台の任意寸法** — ショーケース/プロトのページに限り、`demo scaffolding`
   とコメントした節（`[data-sc]` 規約）に集約して書ける。UI 部品там・
   インラインには書けない

### A3. インライン style

- **直値を含む inline style は禁止**（lint 対象）。`var()` 参照・`0`・`auto`・
  `100%` のみのものは暫定許容だが、繰り返すならクラス化する
- 任意寸法が要る場合は A2-3 の scaffolding 節へ

### A4. スケールの使い方

- 余白は `--lg-ref-space-*` 9段から選ぶ。**中間値を発明しない**。
  「10px が欲しい」は sm(8) か md(12) に倒す
- 文字サイズ・ウェイト・行送りは `.lg-type-*` 6段（または type ref）
- 重なりは `--lg-ref-z-*` 4段。5段目が欲しくなったら設計を疑う
- 角丸のネストは concentric 式（`calc(外側 − 間隔)`）。直値のネスト禁止

### A5. テーマ

- テーマ JSON が上書きしてよいのは **ref 層のみ**（+ ごく限定的な sys の
  face/bcomp）。comp の構造・モーション物理・レイアウト寸法は触らない
- `data-lg-theme` は **html 要素**に付与（JS が単一ソースとして読むため）。
  付け替え後は `LiquidGlass.refresh()`

### A5.5. ソースの編集場所（分割ソース → 生成・**1ファイル1役割**）

**原則: 1ファイル1役割・1部品1フォルダ。**トークンは1グループ1ファイル
（foundations/tokens: ref 17 / sys 4。comp は各部品フォルダ）、CSS/JS/HTML は
1部品（または1関心事）1ファイル、プロンプトは1本1ファイル（prompts/）。
複数役割が同居し始めたら分割してから足す。例外は共有実装の家族
（checkbox-radio 等）と `foundations/a11y/`（全部品の縮退の一元管理）。

- **src/ はアトミックデザインの入れ子構造**:
  `foundations/`（物質・エンジン・基盤）→ `atoms/` → `molecules/` →
  `organisms/` → `templates/`（画面型）→ pages（= showcase/ の実画面）。
  下位は上位を知らない（atoms が organisms を参照したら設計エラー）
- **1部品1フォルダ = 五面セット**: `src/<階層>/<部品>/` に
  **usage.md（使用用途 — いつ使う/使わない・組み合わせ・AI への指示）** /
  html（正規 DOM）/ css（見た目）/ js（挙動）/ tokens.json（値）が同居する。
  部品の参照はこのフォルダ1つで完結する。**usage.md は lint で必須検査**され、
  新部品は usage.md を書いてからマークアップに着手する
- **連結順は `src/manifest.json` が唯一の正**（cascade / JS 実行順）。
  部品を追加したら該当ファイルを manifest の適切な位置に登録する。
  フォルダ名・階層は順序に関与しない
- 編集後は `node tools/build-dist.mjs`（css/js）・`node tools/build-tokens.mjs`
  （tokens）で再生成。**dist の直接編集は禁止**
- マークアップは各部品フォルダの `.html` が正典 — docs/04 や showcase と
  食い違ったらここを直してから他を追随。ページ骨格は `templates/_page-skeleton.html`
- **ページは参照で合成する**: `src/pages/<page>/` に
  `<!-- @include <部品/テンプレのパス> {"key":"値"} -->` で参照ツリーを書き、
  `node tools/build-pages.mjs` で showcase/ を生成。パーシャル側の差し替え点は
  `{{key=既定値}}`（未指定なら既定値 = 単体でも正規マークアップとして読める）。
  部品の修正は参照している全ページに再ビルドで伝播する。コピペ転記は禁止
- `src/js/` は1つの IIFE をフラグメント分割したもの。単体では動かない
  （連結順が前提）。関数の移動は build 後に必ず headless 検査

### A5.7. 観測者効果（R16）

- 製品・QA では既定の `fixed` を使う（`data-lg-seed` でスナップショット再現）
- `personal` は LP・ツアー・ポートフォリオ等の「体験の場」だけで opt-in
- 範囲トークン（sys/observer）に軸を足すときは R 判断必須。
  コントラスト・予算・状態色の意味に触れる軸は永久に禁止

### A5.8. 体質 Physique（R17）

- ホストが個人化する場合は `html[data-lg-trait-motion / -optics]`（0〜1）に
  **抽象値だけ**を渡す。生の属性・履歴データを DS に渡す API は存在しない
  （作らない — R17 プライバシー境界）
- 端末内学習は personal モード限定・±0.08・翌訪問反映。QA は trait を
  data 属性で固定して再現する
- **年齢・職業など属性を使いたい場合**もこの経路のみ: ホスト側で trait に写像して
  渡す（実例: showcase/index.html のペルソナドック=ホスト役スクリプト）。属性は「初期値の仮説」に
  留め、本人の明示設定が常に上書きできること。性別・婚姻歴の直結は非推奨（docs/07 R18）

### A5.9. 環境信号（R18）

- 4信号（太陽同期・傾き応答・バッテリー・懐き）はすべて**端末内で完結**する。
  ネットワーク送信・生データ保存・新規許諾の自動要求はしない
- 個別無効化は `--lg-signals-*` トークン（apple-quiet テーマは全オフ）
- 傾き応答は iOS では明示許諾が必要 — `LiquidGlass.enableTilt()` を
  **ユーザー操作のハンドラ内から**呼ぶ（自動で呼ぶとブラウザに拒否される）
- 懐き（訪問日数）は personal モード限定。fixed モードは常に全開 = QA 決定性を守る
- バッテリー・懐きが動かすのは呼吸深度・点灯強度・押下光学のみ。
  レイアウト・コントラスト・状態色は動かさない（不変レイヤー）
- 現在の信号状態は `LiquidGlass.signals()` で申告される（観測機器の意匠）

### A6. トークンを増やすとき

1. 既存の段・既存トークンで表せないことを確認（lint と Inventory を見る）
2. ref/sys は `src/foundations/tokens/` の該当グループ、comp は該当部品フォルダの
   `{部品名}.tokens.json` に追加。**$description（いつ・なぜ）必須**
3. `node tools/build-tokens.mjs` で再生成。統合 JSON と tokens.css は生成物 — 直接編集禁止

---

## B. コンポーネント利用ルール

各部品の契約詳細は [04-components.md](04-components.md)。ここは「使う側が
破りがちなルール」の一覧。

### B1. 全部品共通

- 部品のクラス名を**ページ CSS で再定義・拡張しない**（`.lg-*` の新規定義は
  コアのみ。ページ固有の見た目は独自クラス名で）
- **`.lg-page` / `.lg-layout-*` の `display` を上書きしない**。これらは flex/grid の
  gap でセクション間隔を作っており、`display: block` を被せた瞬間に画面全体の
  余白リズムが静かに死ぬ（表示切替は `display: flex` / `grid` を維持したまま行う。
  実際に screens.html で起きた事故）
- 部品の内部構造（子要素のクラス）を省略しない。マークアップは 04 の形が正
- focus-visible スタイルを打ち消さない
- `prefers-reduced-*` 3系統の動作を壊す指定をしない

### B2. ガラス部品

| ルール | 対象 |
|---|---|
| `.lg-glass` は機能レイヤーの操作系のみ。読む要素に付けない | 全ガラス |
| ガラス面は1ビューポート3枚まで（シェルは合計1枚・一時面は予算外） | 全ガラス |
| glass on glass 禁止。ガラス上の入力は `.lg-field--fill`（`.lg-glass` 併用禁止） | shell 上の部品 |
| `--primary` は1画面1箇所。他のボタン・テキストに accent を塗らない | button |
| Regular / Clear を同一画面で混在させない。Clear はメディア背景限定 | variant |
| ガラス上のテキストは `var(--lg-ink)` のみ。色付きテキスト禁止 | 全ガラス |
| モーダル/ドロワー/⌘K は必ず `LiquidGlass.modal/drawer/command()` で配線（自前の開閉実装禁止） | overlay |
| tooltip はポインタ追従させない。menu/リムに自律アニメを足さない | motion |

### B3. コンテンツ層部品

| ルール | 対象 |
|---|---|
| table をガラス化しない。`--responsive` を使うなら **td に `data-th` 必須** | lg-table |
| 読むだけのカードは `.lg-panel`。`.lg-card`（ガラス）は押せるカード限定 | panel/card |
| badge/banner の色は状態通知のみ（positive/danger）。装飾に使わない | badge/banner |
| 消える通知は `toast`、留まる通知は `banner`。混同しない | feedback |
| key-value は `.lg-kv`（dl/dt/dd）。その場の flex 実装をしない | kv |

### B4. レイアウト

- 画面は必ず7つの画面型（[02-layout.md](02-layout.md)）から始める。
  型に収まらない場合のみ共通部材（page/header/toolbar/split/actionbar）で組む
- `.lg-page` の外に本文を置かない（余白・最大幅の一元管理を壊すため）
- SP 対応を自前の media query で書き足す前に、部材側の崩れ方（カード化・
  1カラム化・全幅化）で足りないか確認する

### B5. デモ・プロトタイプ

- ショーケースも本番と同じルールで書く（**デモは AI が学ぶ参照実装**であり、
  デモの違反はシステム全体の違反として増殖する）
- 唯一の緩和は A2-3 の scaffolding 節
- ページ独自の装飾背景（コンテンツ層の「作品」）は自由。ただし色は
  トークン/color-mix 経由を推奨

---

## C. 検査

```
node tools/lint-usage.mjs        # ルール違反の機械検出
```

検出対象: コア CSS の直値（structural マーカーなし）/ 生色 /
ショーケースの直値インライン / ページによる `.lg-*` 新規定義。
出荷前チェック（SKILL.md 末尾）に lint を含めること。
