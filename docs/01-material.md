# 01 — Material: 素材仕様

物質の定義は [00-philosophy.md](00-philosophy.md)。この章はその Web 実装仕様。

## 基本の1行

```html
<div class="lg-glass" data-lg-surface="dark">…</div>
```

`.lg-glass` がこの物質。`js/liquid-glass.js` が読み込まれていれば、レンズフィルタの
生成・光源・適応はすべて自動で配線される（`css/tokens.css` → `css/liquid-glass.css` →
`js/liquid-glass.js` の順に読み込む）。

## 光学パラメータ（公理1の実装）

屈折は rounded-rect SDF の数値勾配 × 凸スクワークル `⁴√(1-(1-x)⁴)` 斜率から
生成した変位マップを、RGB 3枚の feDisplacementMap に分けて適用する。

| トークン | 意味 | Regular | Clear |
|---|---|---|---|
| `--lg-material-*-falloff-ratio` | エッジから屈折が減衰する幅（短辺比） | 0.45 | 0.26 |
| `--lg-material-*-scale-ratio` ほか | 最大変位（min/max clamp つき） | 12–44px | 8–120px |
| `--lg-material-*-ca` | 色収差の最大 px | 4 | 4 |
| `--lg-ref-lens-ca-split-r / -b` | 分散比（R 0.86 / B 1.22） | 共通 | 共通 |
| `--lg-material-*-blur` | baseline フォールバック時の blur | 20px | 6px |
| `--lg-material-*-chain-blur` | lens モード時のチェーン内 blur | 1.5px | 0 |
| `--lg-material-*-saturate` | 集光による彩度リフト | 1.4 | 1.2 |

変位マップは `幅×高さ×radius×variant` キーでキャッシュされ、同寸の要素は
フィルタごと共有される。要素の寸法変更後は `LiquidGlass.refresh()` を呼ぶ。

## 2つの相（公理2・3の実装）

```html
<div class="lg-glass">Regular（既定）</div>
<div class="lg-glass" data-lg-variant="clear">Clear</div>
```

- **Regular** — 適応フル。テキストを載せる部品・迷ったらこれ
- **Clear** — 適応なし・高透過。リッチなメディア背景の上**だけ**。
  明 surface（light / text）では 35% の dim 層（`--lg-adaptive-*-clear-dim`）が
  自動で敷かれる。Clear のラベルは常に明色（dim がコントラストを保証する）
- 同一画面で混ぜない

## surface API（公理3の実装）

ガラス個体または祖先に、背後にあるものを宣言する:

```html
<section data-lg-surface="light">  <!-- light | dark | media | text -->
  <button class="lg-glass lg-button">…</button>
</section>
```

| surface | 背後にあるもの | ink | 効果 |
|---|---|---|---|
| `dark`（既定） | 暗い UI・暗い画像 | 明 | 輝度補償 1.16 |
| `light` | 明るい無地・淡色 | 暗 | face 濃いめ、Clear に dim |
| `media` | 写真・動画 | 明（media 用） | 輝度補償 1.05 |
| `text` | 流れる本文・記事 | 暗 | face 濃いめ、Clear に dim |

surface が写像するもの: `--lg-ink`（ラベル明暗）/ `--lg-bcomp`（輝度補償）/
rim 色 / face の不透明度 / Clear の dim / 不透明フォールバック面の色。
**1ページに複数の surface が混在してよい**（そのための API）。

## 縮退3層（フォールバック）

| モード | 条件 | 内容 |
|---|---|---|
| `lens` | Chromium（実描画テストで検出） | 屈折 + 分散 + 集光 |
| `baseline` | その他ブラウザ | blur + saturate + 2光源 inset。**可読性はこの層で完結** |
| `opaque` | `prefers-reduced-transparency` | surface 連動の不透明面 |

現在モードは `LiquidGlass.mode` で取得できる。モードバッジ等の表示は
アプリ側の責務（ライブラリは表示しない）。

## 状態の光学（Prism v2）

状態は色（ステンドグラス・badge）に加えて**光学にも現れる**。ただし:

1. 色通知への**重ね掛け**であり代替ではない（ラベル・ヘルプ文は必須のまま）
2. **rest では発現しない** — hover / focus / press の点灯時のみ（公理4）
3. 語彙は「**虹 = 中立、単色 = 状態**」: **primary** = 点灯強度が常に最大 /
   **error・danger** = 赤の単色収差（壊れた分光）/ **warning** = 黄 /
   **success** = 緑。`.is-error / .is-warning / .is-success` を持つガラス・
   各 status ボタンに自動適用。乱用すると「虹 = 中立」の基準が壊れるので、
   1画面で同時に光らせる状態色は原則1種

## トークンの層構造

- `--lg-ref-*` — 生値。テーマが上書きするのは主にこの層
- `--lg-material-* / --lg-light-* / --lg-adaptive-* / --lg-motion-*` — sys 層（素材レシピ）
- `--lg-button-* / --lg-card-* / --lg-nav-* / --lg-modal-* / --lg-field-*` — comp 層

編集ソースは `src/foundations/tokens/{ref,sys}/` と各部品フォルダの `*.tokens.json`
（役割別 DTCG、全トークン $description つき）。
`node tools/build-tokens.mjs` が統合 JSON（tokens/liquid-glass.tokens.json）と
`css/tokens.css` を再生成する。**生成物2つは直接編集しない。**
