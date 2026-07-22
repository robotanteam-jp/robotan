# STATUS 判定仕様v1.0

STATUS は「へなちょこの現在の状態」を表します。

POWER と FUEL を基準に判定します。

## STATUS 一覧

* ACTIVE
* NORMAL
* RECOVERY
* LOW_POWER
* SHUTDOWN

---

## 判定ルール

### SHUTDOWN

以下のどちらかを満たす場合

* POWER <= 10
* FUEL <= 5

---

### LOW_POWER

以下のどちらかを満たす場合

* POWER <= 30
* FUEL <= 20

ただし SHUTDOWN が優先されます。

---

### RECOVERY

以下のどちらかを満たす場合

* POWER <= 60
* FUEL <= 40

ただし LOW_POWER が優先されます。

---

### NORMAL

以下を満たす場合

* POWER <= 85
* FUEL <= 70

ただし RECOVERY が優先されます。

---

### ACTIVE

それ以外。

---

## 判定優先順位

必ず以下の順番で判定してください。

SHUTDOWN
↓

LOW_POWER
↓

RECOVERY
↓

NORMAL
↓

ACTIVE

---

## 判定例

POWER 95
FUEL 90

→ ACTIVE

---

POWER 75
FUEL 65

→ NORMAL

---

POWER 55
FUEL 70

→ RECOVERY

---

POWER 80
FUEL 30

→ LOW_POWER

FUEL不足を優先します。

---

POWER 25
FUEL 80

→ LOW_POWER

POWER不足を優先します。

---

POWER 8
FUEL 90

→ SHUTDOWN

---

POWER 80
FUEL 3

→ SHUTDOWN

---

## 設計思想

POWER は体力・気力を表します。

FUEL は栄養・睡眠・水分など、生きるためのエネルギーを表します。

どちらか一方でも極端に低下している場合は、より危険な STATUS を優先してください。

Status はロボタンではなく、へなちょこの現在の状態を表すものとします。
