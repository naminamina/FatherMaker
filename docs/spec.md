# Father Maker 仕様書

## 画面仕様
- **IntroScreen**: コンセプト紹介とスタートボタンのみ。短いリード文で「父を想像する体験」であることを強調。
- **ExplanationScreen**: 体験の流れと操作方法を簡潔に説明。次へ進む CTA を配置。
- **QuizScreen**: 複数問の選択式設問。回答配列から `quizToFatherType` がタイプ ID を決定。
- **ResultScreen**: 決定した父アーキタイプの画像・タグ・説明を表示し、「この父を見守る」ボタンでメイン画面へ遷移。
- **Main/FatherScene**: 父の状態・背景・ステータスバー・最新セリフを表示。8 秒間隔で状態変化、6 秒間隔でログ生成。
- **FatherLogPanel**: 時系列ログをリスト表示。ログは localStorage と text cache に保存され、再訪時も閲覧可能。
- **ItemPanel**: 5 種のアイテムを使用でき、反応テキストとステータス変化が発生。
- **SummaryScreen**: その日のログを 50 文字程度に要約し、まとめ文とクロージング文を表示。リセットボタンで全キャッシュをクリア。

## 父アーキタイプ仕様
| ID | 表示名 | 特徴メモ |
| --- | --- | --- |
| supportive | 無口な見守り父 | 寡黙だが家族想い。落ち着いた状態遷移比率。
| laidback | マイペース休憩父 | 休憩とリラックスが多め。ログも柔らかい。
| awkward | 不器用継続父 | まじめで不器用。working/thinking が多い。
| playful | 少年心の残る趣味父 | relaxing や item reaction がにぎやか。
| organized | 静かな段取り父 | 計画的。sleeping/working サイクルが安定。

## 状態遷移仕様
- 状態候補: working / resting / commuting / relaxing / thinking / sleeping。
- `getNextState` により 8 秒ごとに抽選。タイプごとの `tendencies` とランダム係数で加重選択。
- 同一状態連続を避けるためのペナルティを付与。
- `updateStats` で状態ごとに energy/fatigue/mood を加算減算し、0-100 にクランプ。
- アイテム使用時もステータスが変化し、main ループに引き継がれる。

## 背景対応ルール
- working → `bg-office`
- resting → `bg-break-room`
- commuting → `bg-sunset-street`
- relaxing / thinking → `bg-living-room`
- sleeping → `bg-bedroom`
- 画像拡張時も `assetMap.background(state)` に沿って命名する。

## OpenAI + fallback 仕様
- `VITE_OPENAI_API_KEY` が設定されていれば Chat Completions API を呼ぶ。モデルは `VITE_OPENAI_MODEL`（デフォルト `gpt-4o-mini`）。
- 生成対象: 父セリフ、ログ文、タイプ説明、アイテム反応、まとめ文。
- いずれも短文・日本語・生活感を重視し、AI が応答できない場合は `fallbackTexts` が返る。
- Fallback もキャッシュに保存し、API 呼び出し有無に関わらず UI のリズムを一定に保つ。

## localStorage キャッシュ仕様
- プレフィックス: `father-maker.`。
- `father-maker.app-state`: 現在のステップ、父プロフィール、状態、ステータス、ログ、診断履歴を JSON で保持。
- テキストキャッシュ: `father-maker.text.[kind].[key]`。TTL は quote 5 分、log 3 分、item reaction 15 分、summary 30 分、type description 24 時間。
- キャッシュユーティリティ: `src/lib/storage.ts`（セット/取得/削除）と `src/lib/textCache.ts`（キー生成・ハッシュ）に集約。
- Reset 時は `clearStorage()` を呼び、全プレフィックスキーを削除。

## 今後の拡張方針
- 診断設問を追加し、より細かな父らしさを反映。
- ログの可視化（グラフ/タイムライン）や家族視点のコメント追加。
- PWA 化と push 通知で「父が動いた」瞬間を共有。
- 音やライトアニメーションなど、トーンを損なわない演出の拡充。
- OpenAI 応答の多言語対応とローカル LLAMA 系モデルへの差し替え検証。
