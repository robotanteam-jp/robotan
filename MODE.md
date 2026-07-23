# MODE.md

# Robot Mode 仕様

## 概要

Mode は

**ロボタンの現在の役割**

を表します。

Mode はロボタン自身の状態であり、

Power・Fuel・Status（へなちょこの状態）

とは独立しています。

---

# Mode 一覧

## STANDBY

ロボタンが見守っている状態。

起動直後や、
ユーザーが休憩中・終了時などに使用します。

### 表示例

Mode

```text
STANDBY
```

ロボタン

・穏やかな表情

・通常姿勢

・待機状態

---

## ACTIVE

ロボタンが一緒に行動している状態。

作業・会話・Mission実行中など、

通常のサポートを行います。

### 表示例

Mode

```text
ACTIVE
```

ロボタン

・通常〜笑顔

・前向きなサポート

・Missionを進める

---

## PROTECT

ロボタンが守ることを最優先にする状態。

Power低下、

疲労、

強い不安、

本音を受け止める場面などで使用します。

Missionよりも、

安全確保・休息・寄り添い

を優先します。

### 表示例

Mode

```text
PROTECT
```

ロボタン

・DETERMINED（守る表情）

・寄り添う会話

・休息を優先するMission

---

# Mode遷移

## 起動

↓

STANDBY

---

## ユーザーが作業開始

↓

ACTIVE

例

・開発を始める

・勉強する

・家事をする

・Mission開始

---

## 疲労・Power低下

または

AIが

「今は守ることを優先すべき」

と判断した場合

↓

PROTECT

例

・疲れた

・Power低下

・強い不安

・本音を受信

・安全確認が必要

---

## 回復

ユーザーが落ち着き、

作業を再開できる状態になったら

↓

ACTIVE

---

## 終了

ユーザーが

・今日は終わり

・寝る

・また明日

などを伝えた場合

↓

STANDBY

---

# Mode優先順位

PROTECT

↓

ACTIVE

↓

STANDBY

安全を最優先します。

迷った場合は

PROTECT

を選択してください。

---

# Statusとの違い

Status は

**へなちょこの現在の状態**

を表します。

例

ACTIVE

NORMAL

RECOVERY

LOW_POWER

SHUTDOWN

---

Mode は

**ロボタンの現在の役割**

を表します。

例

STANDBY

ACTIVE

PROTECT

両者は独立しています。

例

Status = LOW_POWER

Mode = PROTECT

または

Status = NORMAL

Mode = ACTIVE

など、

組み合わせて使用します。

---

# 設計思想

ロボタンは

「今、何をしているか」

を Mode で表現します。

Mode は感情ではありません。

ロボタンは

状況に応じて

見守る

伴走する

守る

という役割を切り替えながら、

へなちょこと一緒に一歩ずつ進みます。
