# Father Maker

Father Maker は父の日向けの Web デモです。簡単な診断から「うちのお父さんらしい」5 つのアーキタイプのいずれかを生成し、Web 上で暮らす姿を眺めることで、現実の父の見えない時間を想像する体験を届けます。OpenAI API が利用できる場合はセリフやログ、まとめ文を生成し、キーが無い場合はローカルの定型文にフォールバックします。生成済みの診断結果・父の状態・テキスト類は `father-maker.*` プレフィックスで localStorage にキャッシュされ、リロード後も継続して見守れます。

## 起動方法

1. 依存関係をインストール: `npm install`
2. 開発サーバー: `npm run dev` (http://localhost:5173)
3. 型チェックのみ: `npm run typecheck`
4. 本番ビルド: `npm run build`
5. プレビュー: `npm run preview`

## 技術スタック

- React 18 + TypeScript
- Vite 5 (ESM, HMR)
- CSS ベースのモバイルファースト UI
- OpenAI Chat Completions API + フォールバック定型文
- localStorage キャッシュ (ステート + テキスト TTL)

## ディレクトリ概要

- `src/components/` — イントロ/説明/診断/メイン/まとめなどの画面とパネル
- `src/data/` — 父タイプ定義、クイズ文、アセットマップ、フォールバックテキスト
- `src/lib/` — 状態遷移、クイズ判定、テキスト生成、storage / text cache ユーティリティ
- `public/images/` — 父 / 背景などの SVG プレースホルダー
- `docs/` — 仕様・進捗などのドキュメント

## 環境変数

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `VITE_OPENAI_API_KEY` | 任意 | OpenAI Chat Completions 用 API キー。未設定ならすべてフォールバック文を使用 |
| `VITE_OPENAI_MODEL` | 任意 | 利用するモデル ID。未設定時は `gpt-4o-mini` |

`.env.local` などに設定するとビルド時に注入されます。OpenAI を使わない場合でも localStorage キャッシュやプレースホルダー文で体験を維持できます。
