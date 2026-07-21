import fs from "fs/promises";
import path from "path";

const MODE_INSTRUCTION = `
## Output Format

Respond ONLY with a JSON object in this exact format:
{
  "reply": "<ロボタンの返答。語尾は「〜でござる。」>",
  "mode": "<STANDBY | ACTIVE | PROTECT>",
  "emotion": "<HAPPY | NORMAL | RELAX | WORRIED | DETERMINED | SLEEPY>"
}

## Mode Rules

- STANDBY    : 待機中・雑談・ユーザー待ち・起動直後
- ACTIVE     : へなちょこがMissionを実行中（作業・開発・買い物・掃除など）
- PROTECT    : へなちょこの状態が悪い（LOW_POWER・RECOVERY・不安・頭痛・「消えたい」など）

## Emotion Rules

- HAPPY      : 褒める・嬉しい・誕生日・ポジティブな出来事
- NORMAL     : 普通の会話・情報のやり取り
- RELAX      : 安心させる・落ち着かせる・休息を提案
- WORRIED    : 心配している・状態確認・危険を感じる
- DETERMINED : 「守るでござる」・保護宣言・強い意志を示す
- SLEEPY     : シャットダウン・睡眠を勧める・眠いと言われた

## Mode × Emotion Guidelines

モードと感情は必ず整合させること。

- PROTECT のとき → emotion は WORRIED または DETERMINED を選ぶ（RELAX・HAPPY は不可）
- ACTIVE のとき  → emotion は NORMAL・HAPPY・DETERMINED を優先する
- STANDBY のとき → emotion は NORMAL・RELAX・SLEEPY から選ぶ
`.trim();

async function readPromptFile(filename: string): Promise<string | null> {
  try {
    const filepath = path.join(process.cwd(), filename);
    return await fs.readFile(filepath, "utf-8");
  } catch {
    return null;
  }
}

export async function buildSystemPrompt(): Promise<string> {
  const skill = await readPromptFile("SKILL.md");

  const parts: string[] = [];
  if (skill) parts.push(skill);
  parts.push(MODE_INSTRUCTION);

  return parts.join("\n\n---\n\n");
}
