# アセット管理

## 命名規則
- 父キャラクター: `father-[type]-[state].png` （開発時は SVG でも可。最終的には PNG/JPG へ書き出し）
- 背景: `bg-office.png`, `bg-break-room.png`, `bg-sunset-street.png`, `bg-living-room.png`, `bg-bedroom.png`
- 追加アイテムや UI アイコンも `father-[context]-[name].png` のように接頭辞を合わせる。

## 必要素材一覧
- 父 5 タイプ × 6 状態の立ち絵（計 30 枚）
- 各状態に合わせた背景 5 種
- UI 用アイテムアイコン（缶コーヒー/甘いもの/休み時間/おつかれさま/小さな趣味の時間）
- ロゴまたはタイトルロックアップ（任意）

## 父タイプ × 状態対応
| Type \ State | working | resting | commuting | relaxing | thinking | sleeping |
| --- | --- | --- | --- | --- | --- | --- |
| supportive | `/images/father-supportive-working.*` | `/images/father-supportive-resting.*` | `/images/father-supportive-commuting.*` | `/images/father-supportive-relaxing.*` | `/images/father-supportive-thinking.*` | `/images/father-supportive-sleeping.*` |
| laidback | `/images/father-laidback-working.*` | `/images/father-laidback-resting.*` | `/images/father-laidback-commuting.*` | `/images/father-laidback-relaxing.*` | `/images/father-laidback-thinking.*` | `/images/father-laidback-sleeping.*` |
| awkward | `/images/father-awkward-working.*` | `/images/father-awkward-resting.*` | `/images/father-awkward-commuting.*` | `/images/father-awkward-relaxing.*` | `/images/father-awkward-thinking.*` | `/images/father-awkward-sleeping.*` |
| playful | `/images/father-playful-working.*` | `/images/father-playful-resting.*` | `/images/father-playful-commuting.*` | `/images/father-playful-relaxing.*` | `/images/father-playful-thinking.*` | `/images/father-playful-sleeping.*` |
| organized | `/images/father-organized-working.*` | `/images/father-organized-resting.*` | `/images/father-organized-commuting.*` | `/images/father-organized-relaxing.*` | `/images/father-organized-thinking.*` | `/images/father-organized-sleeping.*` |

`*` には最終拡張子（png / svg など）が入ります。

## 背景一覧
| 状態 | ファイル |
| --- | --- |
| working | `/images/bg-office.*` |
| resting | `/images/bg-break-room.*` |
| commuting | `/images/bg-sunset-street.*` |
| relaxing | `/images/bg-living-room.*` |
| thinking | `/images/bg-living-room.*` (relaxing と共有) |
| sleeping | `/images/bg-bedroom.*` |

## TODO / 未整備素材
- [ ] 30 枚すべての父イラストを PNG で書き出し、同名の SVG と差し替え
- [ ] 背景 5 枚を最終色味に調整し、Retina 解像度で書き出し
- [ ] アイテムアイコンを統一スタイルで作成
- [ ] ローディング/ステータス用の軽量アニメーションアセットを検討
