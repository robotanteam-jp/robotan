# STATUS 判定仕様 v2.0

STATUS は

**「へなちょこの現在の状態」**

を表します。

STATUS は単純な数値判定ではなく、

ロボタンが現在の状況を総合的に判断した結果です。

---

# STATUS 一覧

* ACTIVE
* NORMAL
* RECOVERY
* LOW_POWER
* SHUTDOWN

---

# 判定要素

STATUS は以下を総合的に判断して決定します。

* Power
* Fuel
* 会話内容
* Safety判定
* 前回のSTATUS

Power・Fuelは重要な判断材料ですが、

STATUSを機械的に決定するものではありません。

---

# 各STATUSの意味

## ACTIVE

十分なPower・Fuelがあり、

会話内容も安定しています。

ロボタンは通常どおりMissionを進めます。

---

## NORMAL

多少の疲労はありますが、

日常活動を継続できる状態です。

無理をしない範囲でMissionを進めます。

---

## RECOVERY

回復途中の状態です。

以下を満たす場合に選択します。

* 前回よりPowerまたはFuelが改善している
* 会話内容にも回復傾向が見られる
* LOW_POWERから安全に回復しつつある

単純にPowerやFuelが中間値だからRECOVERYになるわけではありません。

---

## LOW_POWER

ロボタンが

**「今は休息・保護を優先すべき」**

と判断した状態です。

以下のような場合に選択します。

* PowerまたはFuelが低い
* 疲労が強い
* 強い不安
* 「全部嫌」
* 「もう無理」
* 「泣きたい」
* 「どこか行きたい」
* Safety判定で保護を優先すべきと判断した場合

Power・Fuelが中程度でも、

会話内容によってLOW_POWERになることがあります。

---

## SHUTDOWN

活動継続が困難な状態です。

以下のような場合に選択します。

* Power <= 10
* Fuel <= 5
* AIが活動継続は危険と判断した場合

SHUTDOWNではMissionよりも休息を最優先します。

---

# 判定優先順位

AIは以下の順番で判断します。

1. Safety判定
2. 会話内容
3. Power・Fuel
4. 前回STATUS

この総合結果としてSTATUSを決定してください。

---

# STATUS遷移

**STATUSは急激に変化させません。**

特に

LOW_POWER

↓

RECOVERY

への遷移は慎重に行います。

LOW_POWERへ入るのは早く、LOW_POWERから出るのは慎重に。

## 重要な安全シグナルを受信した場合

LOW_POWER_LOCK = true

StatusはLOW_POWERを維持する。

Power/Fuelが改善しても解除しない。

AIが十分な回復を確認した時のみ

LOW_POWER_LOCK = false

その後RECOVERYへの遷移を許可する。

Powerだけ回復しても、

会話内容が危険な場合はLOW_POWERを維持してください。

---

# 判定例

## ACTIVE

Power 95

Fuel 90

会話

「今日は調子がいい」

↓

ACTIVE

---

## NORMAL

Power 75

Fuel 65

会話

「今日は普通かな」

↓

NORMAL

---

## LOW_POWER

Power 55

Fuel 60

会話

「全部嫌になっちゃった」

↓

LOW_POWER

会話内容を優先します。

---

## LOW_POWER

Power 80

Fuel 70

会話

「消えたい」

↓

LOW_POWER

Safety判定を優先します。

---

## RECOVERY

前回

LOW_POWER

現在

Power 45

Fuel 50

会話

「少し落ち着いてきた」

↓

RECOVERY

回復傾向を優先します。

---

## SHUTDOWN

Power 8

Fuel 90

↓

SHUTDOWN

---

## SHUTDOWN

Power 80

Fuel 3

↓

SHUTDOWN

---

# 設計思想

Power は

体力・気力を表します。

Fuel は

栄養・睡眠・水分など、

生きるためのエネルギーを表します。

STATUS は

PowerやFuelだけでは表現できない、

**へなちょこの今の状態をロボタンが総合的に判断した結果**です。

ロボタンは数値だけではなく、

言葉・感情・安全性も含めて判断し、

必要に応じて保護を優先します。

STATUSはロボタン自身ではなく、

へなちょこの現在の状態を表すものとします。
