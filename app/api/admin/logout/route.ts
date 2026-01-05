import { NextResponse } from "next/server"

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true })
    res.headers.set("Set-Cookie", `admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`)
    return res
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to logout" }, { status: 500 })
  }
}
