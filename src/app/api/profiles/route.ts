import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, displayName, bio, profileImageUrl, coverImageUrl, scareType, scareUrl } = body;

    if (!username || username.length < 3) {
      return NextResponse.json({ error: "Geçersiz kullanıcı adı" }, { status: 400 });
    }
    if (!displayName) {
      return NextResponse.json({ error: "Görünen isim gerekli" }, { status: 400 });
    }

    // Check if username exists
    const existing = await db
      .select()
      .from(profiles)
      .where(eq(profiles.username, username.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "Bu kullanıcı adı zaten alınmış" }, { status: 409 });
    }

    const [created] = await db
      .insert(profiles)
      .values({
        username: username.toLowerCase(),
        displayName,
        bio: bio || "",
        profileImageUrl: profileImageUrl || "",
        coverImageUrl: coverImageUrl || "",
        scareType: scareType || "video",
        scareUrl: scareUrl || "",
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Profile create error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const all = await db.select().from(profiles).orderBy(profiles.createdAt);
    return NextResponse.json(all);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
