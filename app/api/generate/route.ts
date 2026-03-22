import RunwayML from "@runwayml/sdk";

export const maxDuration = 10;

function send(controller: ReadableStreamDefaultController, data: object) {
  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
}

export async function POST(req: Request) {
  const { brief } = await req.json();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        send(controller, { step: 1 });
        await new Promise(r => setTimeout(r, 500));

        send(controller, { step: 2 });
        const runway = new RunwayML({ apiKey: process.env.RUNWAYML_API_SECRET! });
        const task = await runway.textToVideo.create({
          model: "gen4.5",
          promptText: brief.slice(0, 900),
          ratio: "720:1280",
          duration: 10,
        });

        send(controller, { step: 3 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let t: any = await runway.tasks.retrieve(task.id);
        while (!["SUCCEEDED", "FAILED"].includes(t.status)) {
          await new Promise(r => setTimeout(r, 8000));
          t = await runway.tasks.retrieve(task.id);
        }

        if (t.status === "FAILED") throw new Error(`Runway failed: ${t.failure ?? "unknown"}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const videoUrl = (t.output as any[])?.[0] as string | undefined;
        if (!videoUrl) throw new Error("No video URL returned");

        send(controller, { step: 4 });
        await new Promise(r => setTimeout(r, 300));
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
