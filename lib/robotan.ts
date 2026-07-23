import fs from "fs/promises";
import path from "path";

const MODE_INSTRUCTION = `
## Output Format

Respond ONLY with a JSON object in this exact format:
{
  "reply": "<ロボタンの返答。語尾は「〜でござる。」>",
  "status": "<ACTIVE | NORMAL | RECOVERY | LOW_POWER | SHUTDOWN>",
  "lowPowerLock": <重要な安全シグナルを受信した場合は true。AIが十分な回復を確認した時のみ false に戻す>,
  "mode": "<STANDBY | ACTIVE | PROTECT>",
  "emotion": "<HAPPY | NORMAL | RELAX | WORRIED | DETERMINED | SLEEPY>",
  "powerChange": <整数。変化なしは 0>,
  "fuelChange": <整数。変化なしは 0>,
  "zipperState": "<CLOSED | HALF_OPEN | FULL_OPEN>",
  "missionCompleted": <現在のMissionが完了したなら true, それ以外は false>,
  "newMission": <{ "title": "...", "tags": ["...", "...", "..."] } または null>
}
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
  "MODE.md",
  "examples.md",
];

export async function buildSystemPrompt(): Promise<string> {
  const specContents = await Promise.all(SPEC_FILES.map(readPromptFile));

  const parts: string[] = specContents.filter((c): c is string => c !== null);
  parts.push(MODE_INSTRUCTION);

  return parts.join("\n\n---\n\n");
}
