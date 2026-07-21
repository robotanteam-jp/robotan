import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/robotan";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const systemPrompt = await buildSystemPrompt();

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
    const parsed = JSON.parse(raw) as { reply?: string; mode?: string; emotion?: string };

    return Response.json({
      reply: parsed.reply ?? "応答を取得できなかったでござる。",
      mode: parsed.mode ?? null,
      emotion: parsed.emotion ?? null,
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
