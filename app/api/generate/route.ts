import { GoogleGenerativeAI } from "@google/generative-ai";
import RunwayML from "@runwayml/sdk";
import { NextRequest } from "next/server";

export const maxDuration = 10;

function send(controller: ReadableStreamDefaultController, data: object) {
  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
}

export async function POST(req: NextRequest) {
  const { brief, runwayKey } = await req.json();
  const runwayApiKey = runwayKey?.trim() || process.env.RUNWAYML_API_SECRET!;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Step 1
        send(controller, { step: 1 });
        await new Promise(r => setTimeout(r, 600));

        // Step 2: Gemini prompt engineer
        send(controller, { step: 2 });
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const gemini = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await gemini.generateContent(`
You are a world-class AI video prompt engineer for Runway Gen-4.
Convert this video idea into ONE perfect cinematic Runway prompt.
Rules: max 900 characters, describe only what the camera SEES, ultra-specific visuals, dark luxury style.
Idea: ${brief}
Output ONLY the prompt. Nothing else.`);

        const megaPrompt = result.response.text().trim().slice(0, 900);
        send(controller, { step: 2, prompt: megaPrompt });

        // Step 3: Runway
        send(controller, { step: 3 });
        const runway = new RunwayML({ apiKey: runwayApiKey });
        const task = await runway.textToVideo.create({
          model: "gen4.5",
          promptText: megaPrompt,
          ratio: "720:1280",
          duration: 10,
        });

        // Poll until done
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let t: any = await runway.tasks.retrieve(task.id);
        while (!["SUCCEEDED", "FAILED"].includes(t.status)) {
          await new Promise(r => setTimeout(r, 8000));
          t = await runway.tasks.retrieve(task.id);
        }

        if (t.status === "FAILED") throw new Error(`Runway failed: ${t.failure ?? "unknown"}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const videoUrl = (t.output as any[])?.[0] as string | undefined;
        if (!videoUrl) throw new Error("No video URL returned from Runway");

        // Step 4: send CDN URL directly
        send(controller, { step: 4 });
        await new Promise(r => setTimeout(r, 400));
        send(controller, { video: videoUrl });

      } catch (err: unknown) {
        send(controller, { error: err instanceof Error ? err.message : "Unknown error" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
