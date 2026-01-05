import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || ""
    const cookieToken = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("admin_session="))?.split("=")[1]
    // accept header fallback for debugging / if cookies blocked
    const headerToken = req.headers.get("x-admin-token") || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
    const ADMIN = process.env.ADMIN_TOKEN || ""
    const ok = Boolean(ADMIN && ((cookieToken && cookieToken === ADMIN) || (headerToken && headerToken === ADMIN)))
    return NextResponse.json({ admin: ok })
  } catch (err: any) {
    return NextResponse.json({ admin: false }, { status: 500 })
  }
}
