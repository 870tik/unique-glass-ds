# 04 — Components: コンポーネント契約

コア5部品（Button / Card / Nav / Modal / Field）+ SaaS 拡張部品。各部品は
「取れるマテリアル」「gel の強さ」「radius 連鎖」を契約として持つ。
契約外の組み合わせ（例: button に clear）は作らない。
SaaS 画面での層の割り当ては [02-layout.md](02-layout.md) の対応表を先に見ること。

共通: すべて `.lg-glass` を併用し、`data-lg-surface` の文脈下に置く。
focus-visible スタイルは全部品に定義済み（消さないこと）。

## Button — 2軸マトリクス

**様式（emphasis）× 意味色（tone）** の直交する2軸で全変種を定義する。

| 様式 \\ 色 | neutral | `--accent`(= `--primary`) | `--danger` | `--warning` | `--success` |
|---|---|---|---|---|---|
| **tinted**（既定・`.lg-glass` 併用） | 素通しのガラス | ステンドグラス | 赤 | 黄 | 緑 |
| **`--solid`**（不透明・非ガラス） | ink 面+反転文字 | 不透明アクセント | 不透明赤 | 〃 | 〃 |
| **`--outline`**（線・非ガラス） | ink の線 | 線と文字にトーン | 〃 | 〃 | 〃 |
| **`--quiet`**（最弱・非ガラス） | 気配の塗り | 文字にトーン | 〃 | 〃 | 〃 |

```html
<button class="lg-glass lg-button lg-button--primary" data-lg-gel>Continue</button>
<button class="lg-button lg-button--solid lg-button--danger" data-lg-gel>Delete</button>
<button class="lg-button lg-button--outline lg-button--success" data-lg-gel>Approve</button>
```

- **`--primary` = `--accent` の別名**であり「1画面1箇所」ルールの担い手
- 実装はトーン変数方式: tone クラスは `--lg-btn-tone` を設定するだけ、
  様式クラスがそれを消費する（組み合わせの列挙は存在しない）
- **fill は必須ではない**。solid > tinted > outline > quiet の強度から選ぶ
- 状態色は点灯時に**単色収差**としても現れる（docs/01「状態の光学」）
- **loading（`.is-loading`）はスピナーのみ表示**（寸法維持・SR にはラベル残存）。
  スピナー色は塗り様式で on-accent、outline/quiet でトーン色
- radius: pill。gel: 0.97

## Card

```html
<div class="lg-glass lg-card" data-lg-gel="0.985" tabindex="0">
  <div class="lg-card-body">…</div>
</div>
```

- マテリアル: Regular のみ
- **カードは「押せるカード」に限りガラスにできる**（公理6: ガラス=操作系）。
  読ませるだけのカードはコンテンツ層の不透明カードにする
- 中身は `.lg-card-body`（radius は concentric 連鎖）。gel は浅め 0.985

## Nav（タブバー）

```html
<nav class="lg-glass lg-nav" aria-label="…">
  <button class="lg-tab" aria-selected="true">Home</button>
  <button class="lg-tab">Specimens</button>
</nav>
```

- マテリアル: Regular。**メディア背景の上に浮かべる場合のみ Clear 可**
- アクティブピル（`.lg-nav-pill`）は自動生成され、gel バネで滑走。
  ピルはガラスではなく塗り（glass on glass 禁止の実装例）
- タブは `--lg-ink` のモノクローム。gel: 0.94（小要素は深く潰す）

## Modal

```html
<div class="lg-backdrop" data-lg-surface="dark" aria-hidden="true">
  <div class="lg-glass lg-modal" role="dialog" aria-modal="true">…</div>
</div>
```

- マテリアル: Regular。backdrop は scrim（`--lg-modal-scrim`）
- `LiquidGlass.modal(backdropEl)` が open/close・Esc・外側クリックを配線
- scrim の上はガラスが読みやすい環境なので、本文数行まで許容（可読性予算参照)

## Field（入力）

```html
<div class="lg-glass lg-field">
  <input class="lg-field-input" type="text" aria-label="…">
</div>
```

- マテリアル: Regular（**transient**: rest 85% 不透明度 → focus で全強度）
- 「操作中だけガラス化する」公理6の例外の実装例
- placeholder / 入力文字は `--lg-ink` 連動

## SaaS 拡張 — ガラス（機能レイヤー）

### Shell / Sidebar / Topbar

```html
<div class="lg-shell">
  <aside class="lg-glass lg-sidebar" data-lg-phase="thick">
    <nav class="lg-nav lg-nav--vertical">
      <button class="lg-tab" aria-selected="true">Dashboard</button>…
    </nav>
  </aside>
  <header class="lg-glass lg-topbar" data-lg-phase="thin">…</header>
  <main class="lg-shell-content">…（コンテンツ層）…</main>
</div>
```

- サイドバー + トップバーは**恒常クローム合わせて1枚**（予算計上）
- `data-lg-phase="thick|thin"`: 公式仕様「大きい要素ほど厚いガラス」の実装。
  サイドバーは thick、ツールバーは thin
- 縦ナビのピルも gel バネで滑走（`.lg-nav--vertical`）。ピルは自動生成される
- **ガラス上の検索・入力は塗りで作る**（glass on glass 禁止。app.html の
  `.topbar-search` が実例）

### Menu / Select

```html
<div class="lg-menu-anchor">
  <button>⋯</button>
  <div class="lg-glass lg-menu" data-lg-align="right">
    <button class="lg-menu-item">View</button>
    <div class="lg-menu-sep" role="separator"></div>
    <button class="lg-menu-item is-danger">Delete</button>
  </div>
</div>
```

- 公式モーション「ボタンがメニューへ流動的にモーフ」: 入場はトリガー起点の
  バネ（scale 0.65→1）、退場は軽いフェード
- 矢印キー移動・Esc・外側クリック・aria-expanded は自動配線
- Select は `.lg-select` + `.lg-select-trigger`（塗り）+ 同じ `.lg-menu`。
  選択で `lg-change` CustomEvent を発火

### Command（⌘K パレット）

`.lg-backdrop--command > .lg-glass.lg-command`（input + `.lg-command-item` 群 +
`.lg-command-empty`）。⌘K / Ctrl+K で開閉、入力でフィルタ、矢印 + Enter で実行。
一時オーバーレイなので予算外。SaaS の旗艦要素。

### Toast / Tooltip

- `LiquidGlass.toast(msg, { action, onAction, positive, sticky })` — 右下スタック、
  入場バネ・退場フェード・hover で滞留。スタック上限4
- `data-lg-tooltip="説明"` を付けるだけ。450ms 遅延・**位置固定**（ポインタ非追従、
  公理5）。薄相 baseline のみ（小さすぎて屈折の意味がない）

### Switch / Checkbox / Radio / Slider

公理6の例外「操作子は**操作中だけ**ガラス化する」の実装群。rest は塗り、
押下/ドラッグ中だけノブがガラス化して光る（公式明文の transient 挙動）。

- Switch: ノブは gel バネで滑走。`<label class="lg-switch"><input type="checkbox">
  <span class="lg-switch-track"><span class="lg-switch-knob"></span></span>ラベル</label>`
- Slider: `<input type="range" class="lg-slider">`。値は 1:1（追従遅延なし）
- Checkbox / Radio: `.lg-checkbox` / `.lg-radio` + `.lg-check-box`

### Segmented / Chip

- `.lg-segmented`（`role="tablist"`）: lg-nav の小型版。容器は塗り、ピル共有
- `.lg-chip aria-pressed`: フィルタチップ。選択で ink 反転。塗り部品

## SaaS 拡張 — コンテンツ層（不透明・ガラスの相方）

| 部品 | 用途 | 備考 |
|---|---|---|
| `.lg-panel` | セクション面・カード面 | surface 連動の面色。内側は `.lg-concentric` |
| `.lg-table`（`--compact`） | データテーブル | 読む要素。**ガラス化禁止**。数値列は `.num` |
| `.lg-panel.lg-stat` | KPI タイル | `.lg-stat-label/-value/-delta（.up/.down）` |
| `.lg-form-row` | フォーム行 | `.lg-form-label` + 入力 + `.lg-help`。エラーは `.is-error` |
| field 状態 | disabled / error | `.lg-field.is-error`、`input:disabled` で自動減光 |
| `.lg-progress` / `.lg-spinner` | 進捗 | `data-lg-value` or `LiquidGlass.progress(el,v)`。不定は `.is-indeterminate` |
| `.lg-skeleton`（`--text/--circle`） | ローディング枠 | shimmer は reduced-motion で静止 |
| `.lg-badge`（`.is-positive/.is-danger`）+ `.lg-dot` | ステータス表示 | 色は状態通知のみ（公理2） |
| `.lg-avatar`（`--sm/--lg`）/ `.lg-avatar-group` | アバター | イニシャルフォールバック内蔵 |
| `.lg-banner`（`.is-positive/.is-danger`） | 留まる通知 | toast は消える通知、banner は留まる通知 |
| `.lg-kv`（dl > div > dt+dd） | key-value リスト | Detail のメタ情報等。`dd.strong` で強調 |
| `.lg-icon-button` | 円形アイコンボタン | 塗り。ガラス上/コンテンツ層 両用 |
| `.lg-prose` | 読みものコンテナ | body-size + leading-body + p マージン |

## SaaS 拡張 v3（全部品）

**ガラス（一時面）**: Drawer（`.lg-backdrop--drawer + .lg-drawer`、右から translateX
バネ）/ Popover（`.lg-menu--popover`、フォーム内容可・選択で閉じない・role=dialog）/
Context menu（`data-lg-context="#id"` + `.lg-menu--context`、カーソル位置に開く）/
Date picker（`input[data-lg-datepicker]`、YYYY-MM-DD・`lg-change`）/
Combobox（`.lg-select.lg-combobox`、入力フィルタ + Enter 確定）

**塗り**: Breadcrumbs（`aria-current="page"`）/ Pagination（`.lg-pagination-item`）/
Stepper（`.lg-stepper` ol/li、`.is-done/.is-current`）

**コンテンツ層**: Accordion（`details.lg-accordion`、native）/ Empty state
（`.lg-empty`）/ Dropzone（`.lg-dropzone`、**drag over の間だけガラス化** =
transient の応用。`lg-files` CustomEvent）

**結合**: Tabs は `.lg-tab[aria-controls]` でパネルの hidden / role=tabpanel を
自動管理。モバイルは md(900px) で shell がオフキャンバス化（`.lg-shell-menu-btn`、
`is-nav-open`、Esc / scrim で閉じる）

## field 拡張

- **Textarea**: `.lg-field--multi` + `<textarea class="lg-field-input" data-lg-autosize>`
- **Affix**: `.lg-field-affix` を input の前後に置く（prefix / suffix アイコン）
- **Fill 相**: `.lg-field--fill`（`.lg-glass` を併用しない）— ガラスの上に置く
  検索・入力用の塗り。glass on glass 禁止の正規解
- **Button 状態**: `:disabled` で減光 + 操作停止、`.is-loading` でスピナー表示

## 基盤スケール

タイポ（`.lg-type-*` 6段）・余白（`--lg-ref-space-*` 8段）・z-index（`--lg-ref-z-*`
4段）は [06-foundation.md](06-foundation.md)。部品の直値はこの段階に揃える。

実例は [showcase/app.html](../showcase/app.html)（SaaS ダッシュボードのデモ）。

## 新しい部品を作るとき

1. まず問う: それは操作できるか？（No → コンテンツ層。ガラスにしない）
2. 契約を書く: マテリアル / gel 値 / radius 連鎖（concentric 式）/ surface 依存
3. comp 層トークンを `src/tokens/comp/部品名.tokens.json` に足し、$description に「いつ使うか」を書く
4. focus-visible を定義する
5. `prefers-reduced-*` 3系統で確認してから出荷
