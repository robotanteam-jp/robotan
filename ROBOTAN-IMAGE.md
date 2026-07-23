# ロボタン画像表示仕様 v1.0

## 概要

ロボタンは通常、前面画像を表示します。

PCではマウスホバー、
スマートフォン・タブレットではタップ操作により、
背面画像を表示できます。

背面画像は現在のファスナー状態と連動します。

---

# 通常表示

表示画像

```text
robotan-○○.png
```

例

* normal
* happy
* protect
* worried

など、現在の表情（EXPRESSION）に応じた前面画像を表示します。

---

# PC

ロボタン画像へマウスを乗せると

約0.3秒で背面画像へ切り替えます。

マウスを離すと

約0.3秒で元の前面画像へ戻します。

---

# スマートフォン・タブレット

ロボタン画像をタップすると

前面 ⇔ 背面

を切り替えます。

約30秒操作が無い場合は

自動的に元の前面画像へ戻します。

---

# 背面画像

背面画像は

現在のファスナー状態

と連動します。

## CLOSED

表示画像

```text
robotan-back.png
```

---

## HALF_OPEN_HOLD_HENACHOKO

表示画像

```text
robotan-back-half-open.png
```

---

## FULL_OPEN_HOLD_HENACHOKO

表示画像

```text
robotan-back-full-open.png
```

---

## FULL_OPEN_EMPTY

表示画像

```text
robotan-back-full-open-empty.png
```

---

# ファスナー連動

背面画像は

ZipperState

に応じて自動で切り替えます。

| ZipperState | 表示画像                       |
| ----------- | -------------------------- |
| CLOSED      | robotan-back.png    |
| HALF_OPEN   | robotan-back-half-open.png |
| FULL_OPEN   | robotan-back-full-open.png |

ファスナー状態が変化した場合、

背面画像もリアルタイムで更新してください。

---

# 前面との連動

前面画像は

Expression

に応じて切り替えます。

例

* robotan-normal.png
* robotan-happy.png
* robotan-protect.png
* robotan-worried.png

背面画像は

Expressionでは変化せず、

ZipperStateのみ反映します。

---

# アニメーション

切り替えは

フェードまたは軽いクロスフェード

（約300ms）

とします。

3D回転演出は行いません。

自然で優しい動きを目指してください。

---

# 設計思想

ロボタンは

普段はへなちょこの方を向いています。

背面は、

「少しだけロボタンの秘密を見せてくれる」

演出です。

背中にあるファスナーは、

ロボタンが本音を受け止めるために

自ら心を開いた証です。

そのため、

背面画像は常に現在のファスナー状態と一致させてください。

背面は情報表示ではなく、

ロボタンの世界観を感じてもらうための演出として扱います。


# 拡張構想案

背面をクリックすると小さな情報パネルが開くのも面白そう。

例えば、

Robot ID：RBT-001
Firmware：v1.0
Emergency Spring：READY
Last Mission：ウェビナー画面を開く

みたいな「ロボタンの整備パネル」が見られる。