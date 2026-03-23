import RunwayML from "@runwayml/sdk";

export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    const { brief, model = "gen4.5" } = await req.json();
    const duration = model === "gen4.5" ? 10 : 5;

    const runway = new RunwayML({ apiKey: process.env.RUNWAYML_API_SECRET! });
    const task = await runway.textToVideo.create({
      model: model,
      promptText: brief.slice(0, 900),
      ratio: "720:1280",
      duration: duration,
    });

    return Response.json({ taskId: task.id });
  } catch (err: unknown) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
