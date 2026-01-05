import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const token = String(body?.token || "")
    const ADMIN = process.env.ADMIN_TOKEN || ""
    if (!ADMIN || !token || token !== ADMIN) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    const maxAge = 60 * 60 * 24 * 7 // 7 days
    const secure = process.env.NODE_ENV === "production"
    // Use Lax instead of Strict for better compatibility, especially in development
    const sameSite = process.env.NODE_ENV === "production" ? "Strict" : "Lax"

    const res = NextResponse.json({ ok: true })
    res.headers.set("Set-Cookie", `admin_session=${token}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}${secure ? "; Secure" : ""}`)
    console.log("Admin login successful, cookie set")
    return res
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to login" }, { status: 500 })
  }
}
