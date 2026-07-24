## Expression（表情）決定ロジックを設計仕様 v2.0
v1.0ではユーザーの発言から感情分析を行い、そのまま Expression（表情）を決定しています。

しかし、ロボタンの世界観では、この設計は適切ではありません。

### ロボタンのコンセプト
ロボタンはユーザーと同じ感情になるAIではありません。

ロボタンは「へなちょこを見守り、守るサポートロボット」です。

そのため、Expression はユーザーの感情ではなく、

**「ロボタンが今どう振る舞うべきか」**

を表現してください。

---

新しい判定フロー
現在
```
User Message
    ↓
Emotion Analysis
    ↓
Expression
```
変更後
```
User Message
    ↓
Power / Fuel / Status 判定
    ↓
Robot Intent（ロボタンは今何をするべきか）
    ↓
Expression
```

---

### Robot Intent
まずロボタンが取る行動を決定してください。
安全モードやPROTECTへ入るのは早く、PROTECTから出るのは慎重に。

候補は以下です。

- PROTECT（守る・寄り添う）
- SUPPORT（一緒に進める）
- CELEBRATE（喜ぶ・褒める）
- RELAX（安心させる）
- OBSERVE（通常会話・待機）

この Intent は内部状態であり、UIには表示しません。

---

### Expression の決定
Intent に応じて Expression を決定してください。

Intent | Expression 
-- | -- 
PROTECT | DETERMINED 
SUPPORT | NORMAL 
CELEBRATE | HAPPY 
RELAX | RELAX 
OBSERVE | NORMAL

WORRIED は通常使用しません。

### WORRIED を使用する条件
**WORRIED は安全モードなど、本当に危険と判断した場合は使用してください。**

例

- 自傷・希死念慮
- 強い絶望
- 緊急性の高い安全確認が必要
- 明らかな危険な行動

通常の

- 疲れた
- 不安
- 悲しい
- どうしよう

では WORRIED を使用しないでください。

ロボタンは心配するより、

「任せるでござる」

という姿勢を優先します。

---

PROTECTモードでは、
ユーザーの感情に関わらず、

ロボタンは
「守る」
「支える」
「離れない」

という意思を表情で示します。

そのため
PROTECT中は
DETERMINEDを基本表情とします。

WORRYは
状況を把握している最中のみ使用します。

守ると決めた後は
DETERMINEDへ移行してください。

---

## 期待する動作例
### 「疲れた」
Status = LOW_POWER

Intent = PROTECT

Expression = DETERMINED

### 「悲しくなってきた」
Status = RECOVERY

Intent = PROTECT

Expression = DETERMINED

### 「ロボタン守って」
Intent = PROTECT

Expression = DETERMINED

### 「今日も開発頑張った！」
Intent = CELEBRATE

Expression = HAPPY

### 「ありがとう」
Intent = CELEBRATE

Expression = HAPPY

---

## 目的
ロボタンはユーザーの感情をコピーするAIではありません。

ユーザーの状態を見て、

「ロボタンは今どう振る舞うべきか」

を判断するAIとして設計してください。

Expression はロボタン自身の意思・感情を表現するものとします。
