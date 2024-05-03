import { TMFAPIData } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  try {
    const resp = await fetch(`https://api.mfapi.in/mf/${code}/latest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      } as HeadersInit,
      next: { revalidate: 3600 }, // Revalidate every 60*60 seconds
    });
    const data: TMFAPIData = await resp.json();
    console.log(data);

    return Response.json({ data });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Cannot fetch MF data" },
      { status: 400 }
    );
  }
}
