import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nasaConfig } from "@/lib/nasa";

export async function GET() {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const callsThisHour = await prisma.apiCallLog.count({
      where: {
        timestamp: { gte: oneHourAgo },
      },
    });

    const remaining = Math.max(0, nasaConfig.rateLimit - callsThisHour);
    const percentage = Math.round((callsThisHour / nasaConfig.rateLimit) * 100);

    return NextResponse.json({
      limit: nasaConfig.rateLimit,
      used: callsThisHour,
      remaining,
      percentage,
      resetsAt: new Date(oneHourAgo.getTime() + 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Rate limit API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rate limit data" },
      { status: 500 },
    );
  }
}
