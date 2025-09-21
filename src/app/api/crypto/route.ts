import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const file = path.join(process.cwd(), "public", "mock", "crypto-24h.json");
  const data = await fs.readFile(file, "utf-8");
  return new NextResponse(data, { headers: { "Content-Type": "application/json" } });
}
