import fs from "fs/promises";
import path from "path";

const MODE_INSTRUCTION = `
## Output Format

Respond ONLY with a JSON object in this exact format:
{
  "reply": "<ロボタンの返答。語尾は「〜でござる。」>",
  "mode": "<STANDBY | ACTIVE | PROTECT>",
  "emotion": "<HAPPY | NORMAL | RELAX | WORRIED | DETERMINED | SLEEPY>",
  "powerChange": <整数。変化なしは 0>,
  "fuelChange": <整数。変化なしは 0>,
  "zipperState": "<CLOSED | HALF_OPEN | FULL_OPEN>",
  "missionCompleted": <現在のMissionが完了したなら true, それ以外は false>,
  "newMission": <{ "title": "...", "tags": ["...", "...", "..."] } または null>
}

## Mode Rules

- STANDBY : 待機中・雑談・ユーザー待ち・起動直後
- ACTIVE  : へなちょこがMissionを実行中（作業・開発・買い物・掃除など）
- PROTECT : へなちょこの状態が悪い（疲れ・不安・体調不良・「消えたい」など）
`.trim();

async function readPromptFile(filename: string): Promise<string | null> {
  try {
    const filepath = path.join(process.cwd(), filename);
    return await fs.readFile(filepath, "utf-8");
  } catch {
    return null;
  }
}

const SPEC_FILES = [
  "SKILL.md",
  "SAFETY.md",
  "POWER-FUEL.md",
  "STATUS.md",
  "MISSION.md",
  "EXPRESSION.md",
  "ZIPPER.md",
  "examples.md",
];

export async function buildSystemPrompt(): Promise<string> {
  const specContents = await Promise.all(SPEC_FILES.map(readPromptFile));

  const parts: string[] = specContents.filter((c): c is string => c !== null);
  parts.push(MODE_INSTRUCTION);

  return parts.join("\n\n---\n\n");
}
