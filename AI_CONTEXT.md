# Father Maker AI Context

## Summary
- 父の日向けに「見えない時間を想像する」Web 体験を提供する React + TypeScript プロジェクト。
- 5 種類の父アーキタイプを診断で選び、状態変化とテキスト生成で生活感を演出する。

## Concept
- ゲーム的な勝敗ではなく、父の生活をそっと覗き見る感覚を重視。
- ユーザーは画面越しに父を見守り、現実の父を想起するきっかけを得る。

## Father Archetypes
- supportive = 無口な見守り父
- laidback = マイペース休憩父
- awkward = 不器用継続父
- playful = 少年心の残る趣味父
- organized = 静かな段取り父

## States
- working / resting / commuting / relaxing / thinking / sleeping
- 状態に応じて背景・セリフ・ステータス変化が変わる。

## Asset Naming
- 父画像: `father-[type]-[state].png` （現在は SVG プレースホルダーを使用）
- 背景画像: `bg-office.png`, `bg-break-room.png`, `bg-sunset-street.png`, `bg-living-room.png`, `bg-bedroom.png`

## OpenAI Usage
- `VITE_OPENAI_API_KEY` がある場合のみ Chat Completions API を呼び出す。
- 未設定時は `src/data/fallbackTexts.ts` の定型文にフォールバックする。
- プロンプトは短く、生活感のある日本語テキストを返すよう設計。

## Cache Policy
- localStorage に `father-maker.` プレフィックスで保存。
- 診断結果・父プロフィール・状態・ログは永続化し、リロード後も継続体験。
- テキストキャッシュ TTL 目安: quote 5分 / log 3分 / summary 30分 / item reaction 15分 / type description 24時間。
- フォールバック文も同じキーでキャッシュする。

## UI Tone
- モバイルファースト、柔らかな色と余白で余韻を残す。
- アイコンやモーションは控えめで、父の穏やかな生活を映す。

## Guideline
- 「ゲーム」ではなく「父を想像する体験」を最優先。
- 新しい機能もこのトーンと観察体験を壊さないように実装すること。
