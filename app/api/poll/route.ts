import RunwayML from "@runwayml/sdk";

export const maxDuration = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return Response.json({ error: "Missing taskId" }, { status: 400 });
  }

  try {
    const runway = new RunwayML({ apiKey: process.env.RUNWAYML_API_SECRET! });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t: any = await runway.tasks.retrieve(taskId);

    if (t.status === "SUCCEEDED") {
      const videoUrl = (t.output as any[])?.[0] as string | undefined;
      if (!videoUrl) return Response.json({ error: "No video URL" }, { status: 500 });
      return Response.json({ status: "SUCCEEDED", videoUrl });
    }

    if (t.status === "FAILED") {
      return Response.json({ status: "FAILED", error: t.failure ?? "Unknown failure" });
    }

    return Response.json({ status: t.status });
  } catch (err: unknown) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
