# Unique Glass DS

独自素材 **Prism** — 光を曲げ、**分光する**ガラス — による buildless の
デザインシステム。blur の飾りではなく lensing を一次定義とし、分散を隠さず
署名とする。すべてのルールをひとつの架空の物質の物理から演繹する
（Apple Liquid Glass 相当の控えめな光学は theme apple-quiet で後方互換）。

- 依存ゼロ・ビルドツール不要（node はトークン生成のみ）
- Chromium で屈折フル再現、全ブラウザで成立する3層縮退（lens/baseline/opaque）
- トークン 369個（DTCG 形式・全て $description つき）。ソースは役割別に分割
- 部品 40種超（ガラス24 + 塗り/コンテンツ層16）+ 基盤スケール5系統
  （型・余白・重なり・ブレークポイント・チャート色）。SaaS のプロダクト UI を
  組み切れる（棚卸し表 = catalog.html の Inventory は全項目 実装済み）
- AI が判断に使える手順書（SKILL.md）を一級成果物として同梱

## ライセンスと免責

MIT ライセンス。**商用利用・改変・再配布は自由**です。ただし本システムは
現状有姿（AS IS）で提供され、**動作・品質・特定目的への適合性は一切保証しません**。
利用によって生じたいかなる損害についても、作者は責任を負いません（詳細は LICENSE）。

## カスタマイズして導入したい方へ

トークン設計の調整・ブランド適用・画面設計まで含めた導入支援を請け負います。
[taikihanaoka.com](https://taikihanaoka.com/) からご連絡ください。

## 入手と利用（二本立て）

1. **そのまま使う** — showcase/unique-glass-ds.zip（LP からダウンロード可）。
   `node tools/export-package.mjs` で再生成。npm 公開の準備も済んでいる:
   package.json の files が zip と共通の配布定義で、`npm publish` 一発で
   `unique-glass-ds`（名前確保確認済み・2026-09）として公開できる
2. **カスタマイズして納品** — この 04_production/ を丸ごとフォークし、
   src/ の五面セットとトークンを案件用に改変 → build 一式を回して納品。
   判断記録（docs/07）と lint ごと渡すのが納品価値

## 成果物の対応表（ブリーフの8カテゴリ）

| 成果物 | 実体 |
|---|---|
| デザイントークン | `tokens/liquid-glass.tokens.json`（+ `tokens/themes/`）→ 生成 CSS |
| UI コンポーネント | `css/liquid-glass.css` + `js/liquid-glass.js`（一覧: `showcase/catalog.html`） |
| スキル・Markdown ファイル | `SKILL.md`（AI 向け判断手順書） |
| テキストプロンプト | `prompts.md`（P1〜P6） |
| レイアウトルール | `docs/02-layout.md` + `docs/06-foundation.md` |
| デザインフィロソフィー | `docs/00-philosophy.md`（6公理） |
| デザイン思考・設計思想 | `docs/07-rationale.md`（判断記録 R1〜R10） |
| 各種仕様・ガイドライン | `docs/01-material.md` / `03-motion.md` / `04-components.md` / `05-accessibility.md` |

## 構成

```
src/                             アトミックデザインの分割ソース（参照・編集はここ）
├── foundations/                 物質（material/光学）・エンジン(js)・タイポ・a11y・tokens(ref/sys)
├── atoms/<部品>/                最小部品。1フォルダに usage.md/html/css/js/tokens の五面
├── molecules/<部品>/            atom の組合せ（field・select・switch・toast …）
├── organisms/<部品>/            自立ブロック（shell・table・modal・command …）
├── templates/<型>/              画面型・レイアウト部材（page・split・auth …）
├── pages/<page>/                ページの参照ツリー（@include で部品・型を合成）
└── manifest.json                連結順の唯一の正（cascade / JS 実行順）
tokens/liquid-glass.tokens.json  生成物（統合 DTCG。外部ツール連携用）。直接編集しない
tools/build-tokens.mjs           src の tokens をマージ → 統合 JSON + css/tokens.css 生成
css/tokens.css                   生成物。直接編集しない
tools/build-dist.mjs             manifest 順に連結 → dist 生成（node、依存ゼロ）
tools/build-pages.mjs            src/pages の @include ツリー → showcase/ を合成生成
css/liquid-glass.css             生成物（素材 + 全部品）。直接編集しない
js/liquid-glass.js               生成物（レンズエンジン / Spring / 光源 / 適応）。同上
showcase/index.html              トップ LP（生成物 — src/pages/index/ の参照合成。各ページへのハブ）
showcase/app.html                SaaS ダッシュボードのデモ（二層モデルの手本）
showcase/index.html              LP（生成物 — コンセプト5帯 + ペルソナドックで触って学ぶ）
showcase/catalog.html            コンポーネントカタログ（Storybook 風・棚卸し表つき）
showcase/screens.html            画面レイアウト型 7種のデモ（生成物 — src/pages/screens/ の参照合成）
tokens/themes/ · css/themes/     テーマオーバーレイ（studio-dark）
SKILL.md                         AI 向け判断手順書（デシジョンツリー）
prompts.md · prompts/            プロンプト集（1本1ファイル + インデックス）
docs/
├── 00-philosophy.md             6公理（物質の定義。全ルールの根拠）
├── 01-material.md               素材仕様（光学・Regular/Clear・surface API・縮退）
├── 02-layout.md                 レイヤー規範（二層モデル・予算・concentricity）
├── 03-motion.md                 モーション（gel バネ・仮想光源・禁止事項）
├── 04-components.md             コンポーネント契約（コア + SaaS 拡張 + 追加手順）
├── 05-accessibility.md          a11y（3メディアクエリ・コントラスト保証・検査手順）
├── 06-foundation.md             基盤スケール（タイポ6段・余白9段・z-index 4段 ほか）
├── 07-rationale.md              設計判断の記録（R1〜R10、ADR 形式）
└── 08-usage-rules.md            利用ルール（トークン参照方向・直値禁止・部品の使い方）
tools/lint-usage.mjs             利用ルールの機械検査（node tools/lint-usage.mjs）
tools/export-site.mjs            公開サイトへのデプロイ（showcase をフラット化 + ランタイム同梱。
                                 配置先パスは引数で指定可能）
assets/icons/                    アイコン原本（Lucide / ISC・LICENSE.txt 同梱）
assets/fonts/                    声（Space Grotesk + IBM Plex Mono / OFL・計70KB）
assets/media/                    主要インタラクションの録画 4本（webm・営業/ドキュメント用）
tools/video/                     録画ツール（開発専用・puppeteer-core。DS 本体は依存ゼロのまま）
tools/build-icons.mjs · js/lg-icons.js   sprite 生成と注入（<i data-lg-icon="name">）
```

## 使い始める

```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/liquid-glass.css">
<script src="js/liquid-glass.js" defer></script>

<section data-lg-surface="dark">
  <button class="lg-glass lg-button lg-button--primary" data-lg-gel>Continue</button>
</section>
```

AI に組ませる場合は `SKILL.md` を最初に読ませ、`prompts.md` の雛形を使う。

## 変更のルール

1. 値の変更は `src/foundations/tokens/`（ref/sys）または部品フォルダの tokens →
   `node tools/build-tokens.mjs`。
   統合 JSON・tokens.css は生成物で直接編集禁止（直値を書いた時点で契約違反）
2. 新しい見た目・動きは、まず `docs/00-philosophy.md` の6公理のどれの帰結かを
   言えること。言えないものは装飾として却下
3. 出荷前チェックは `SKILL.md` 末尾（headless 検査・prefers-reduced-* 3系統・
   コントラスト AA・キーボード操作・ガラス予算の再カウント）

## 出自

制作: Taiki Hanaoka / creative-studio（2026-09）。
リサーチと批評の経緯は `../02_moodboard/` と `../03_explorations/critique.md`。
