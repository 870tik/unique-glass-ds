# 06 — Foundation: 基盤スケール

タイポグラフィ・余白・重なりの3スケール。すべての部品・ページはこの段階の上に組む。
**中間値を発明しない**こと。足りない段が必要になったら、値をその場で書くのではなく
トークンに段を追加してから使う。

## タイポグラフィスケール（6段）

ユーティリティ `.lg-type-*` または `--lg-ref-type-*` の var 参照で使う。

| クラス | サイズ | ウェイト | 用途 |
|---|---|---|---|
| `.lg-type-display` | 24px | semibold(650) | ページ見出し（h1）。1画面1回 |
| `.lg-type-title` | 19px | semibold | セクション見出し（h2） |
| `.lg-type-heading` | 15px | semibold | パネル見出し・モーダルタイトル |
| `.lg-type-body` | 13.5px | regular(400) | 本文・テーブル・メニューの基準 |
| `.lg-type-caption` | 11.5px | regular | 補足・ヘルプ・差分 |
| `.lg-type-label` | 10px | medium(500) | uppercase の技術ラベル（tracking .14em 込み） |

- 行送りは2種のみ: 見出し系 `leading-tight`(1.3) / 本文系 `leading-body`(1.7)
- ガラス上のテキストは常に `--lg-ink`（05-accessibility 参照）。type クラスは
  サイズ・ウェイトだけを与え、色は surface が決める
- 部品の内部フォントサイズ（button 14px 等）は comp トークン側にあり、
  このスケールと段が揃うよう保守する

## 余白スケール（8段）

`--lg-ref-space-{xs|sm|md|lg|xl|2xl|3xl|4xl}` = 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48px

| 段 | 使い所 |
|---|---|
| xs 4 | アイコンとラベルの間 |
| sm 8 | 同グループ内の部品間 |
| md 12 | 部品間の標準 gap |
| lg 16 | カード / パネル間 |
| xl 20 | パネル内の主要ブロック間 |
| 2xl 24 | セクション内の余白 |
| 3xl 32 | セクション間 |
| 4xl 48 | ページブロック間 |

## z-index スケール（4段）

`--lg-ref-z-*`。ガラスの一時面はこの4段だけで重なる:

```
menu 80  <  backdrop 100  <  toast 140  <  tooltip 160
```

- menu: アンカー相対の一時面（ドロップダウン・ポップオーバー）
- backdrop: scrim を伴う面（modal / command）
- toast: 通知はモーダル中でも見える
- tooltip: 常に最前面
- **新しい段が必要になったら、足す前に設計を疑う**（一時面が5層重なる UI は
  たいてい情報設計の問題）

## ブレークポイント（3段）

`--lg-ref-breakpoint-{sm|md|lg}` = 640 / 900 / 1200。

- **CSS の `@media` はカスタムプロパティを読めない**ため、CSS 内では同値の
  リテラルを使う。トークンが正であり、変更時は両方を更新する（唯一の例外規定）
- md(900) で `.lg-shell` のサイドバーはオフキャンバス化する。トップバーに
  `.lg-shell-menu-btn` が現れ、開閉は `is-nav-open` クラス（自動配線）。
  Esc / scrim クリックで閉じる

## アイコン規範（実装済み: Lucide sprite）

- **セット: [Lucide](https://lucide.dev)**（ISC ライセンス = 無料・商用可・帰属不要）。
  原本は `assets/icons/*.svg`（単一ソース）、`node tools/build-icons.mjs` で
  `js/lg-icons.js`（インライン sprite 注入）を生成
- **使い方**: `js/lg-icons.js` を読み込み、`<i data-lg-icon="search"></i>` と書く →
  `svg.lg-icon` に自動置換。JS からは `LGIcons.svg('name')` / `LGIcons.scan(root)`
- サイズは2段のみ: 標準 `--lg-ref-size-icon`(15px) / 大 `.lg-icon--lg`(18px)
- 色は常に `currentColor`（surface の ink に自動追従。アイコン単体に色を
  持たせない — 公理2）。線幅は `--lg-ref-size-icon-stroke`(1.5px) で全種統一
- アイコンを増やすとき: Lucide から SVG を `assets/icons/` に追加 →
  `node tools/build-icons.mjs`。他セットの混入禁止（線の語彙が濁る）
- 収録21種は catalog.html の Foundation ストーリーに一覧表示される

## チャートパレット（カテゴリカル6色）

`--lg-ref-color-chart-1`〜`chart-6`。ペリウィンクル（アクセント同系）を第1系列に、
明度を揃えた6色。

- チャートは**コンテンツ層に描く**（読む要素。ガラスの上にチャートを置かない）
- 7系列以上になったら色を増やすのではなく集約を検討する
- 正負の意味を持つ値は既存の `positive` / `danger` トークンを使う
