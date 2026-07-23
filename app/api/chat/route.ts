import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/robotan";

const MOCK_RESPONSE = {
  reply: "受信したでござる。現在デモモードで稼働中でござる。",
  status: "NORMAL",
  lowPowerLock: false,
  mode: "STANDBY",
  emotion: "NORMAL",
  powerChange: 0,
  fuelChange: 0,
  zipperState: "CLOSED",
  missionCompleted: false,
  newMission: null,
};

export async function POST(req: Request) {
  const { message, context } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(MOCK_RESPONSE);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const basePrompt = await buildSystemPrompt();
  const stateContext = context
    ? `\n\n## 現在の状態（参照用）\n- status: ${context.status}\n- lowPowerLock: ${context.lowPowerLock}`
    : ''
  const systemPrompt = basePrompt + stateContext;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: message,
      config: {
        ...(systemPrompt && { systemInstruction: systemPrompt }),
        responseMimeType: "application/json",
      },
    });

    const raw = response.text ?? "{}";
    const parsed = JSON.parse(raw) as {
      reply?: string; status?: string; lowPowerLock?: boolean; mode?: string; emotion?: string;
      powerChange?: number; fuelChange?: number; zipperState?: string;
      missionCompleted?: boolean; newMission?: { title: string; tags: string[] } | null;
    };

    return Response.json({
      reply:            parsed.reply ?? "応答を取得できなかったでござる。",
      status:           parsed.status ?? null,
      lowPowerLock:     typeof parsed.lowPowerLock === 'boolean' ? parsed.lowPowerLock : null,
      mode:             parsed.mode ?? null,
      emotion:          parsed.emotion ?? null,
      powerChange:      typeof parsed.powerChange === 'number' ? parsed.powerChange : 0,
      fuelChange:       typeof parsed.fuelChange  === 'number' ? parsed.fuelChange  : 0,
      zipperState:      parsed.zipperState ?? null,
      missionCompleted: typeof parsed.missionCompleted === 'boolean' ? parsed.missionCompleted : false,
      newMission:       parsed.newMission ?? null,
    });
  } catch (err: unknown) {
    const body = err instanceof Error ? err.message : String(err);

    if (body.includes('"code":429') || body.includes("RESOURCE_EXHAUSTED")) {
      return Response.json(
        { error: "本日のリクエスト上限に達したでござる。明日また話しかけてでござる。" },
        { status: 429 }
      );
    }
    if (body.includes('"code":503') || body.includes("UNAVAILABLE")) {
      return Response.json(
        { error: "ただいまシステムが混雑しているでござる。少し待ってから再試行してでござる。" },
        { status: 503 }
      );
    }

    console.error("Gemini API error:", body);
    return Response.json({ error: "通信に失敗したでござる。" }, { status: 500 });
  }
}
