import { NextResponse } from "next/server"

import { readProjectsStorage, writeProjectsStorage } from '@/lib/storage'

function parseAdminCookie(cookieHeader: string): string | undefined {
  if (!cookieHeader) return undefined
  const cookies = cookieHeader.split(";").map((s) => s.trim())
  const adminCookie = cookies.find((s) => s.startsWith("admin_session="))
  if (!adminCookie) return undefined
  return adminCookie.split("=").slice(1).join("=")
}

function resolveAdminToken(req: Request, bodyToken?: string): string | undefined {
  const h = req.headers.get("x-admin-token")
  if (h) return h.trim()
  const auth = req.headers.get("authorization")
  if (auth?.match(/^Bearer\s+/i)) return auth.replace(/^Bearer\s+/i, "").trim()
  if (bodyToken) return String(bodyToken).trim()
  return parseAdminCookie(req.headers.get("cookie") || "")
}

function assertAdmin(req: Request, bodyToken?: string) {
  const ADMIN = process.env.ADMIN_TOKEN || ""
  if (!ADMIN) {
    return { ok: false as const, res: NextResponse.json({ error: "Server configuration error" }, { status: 500 }) }
  }
  const token = resolveAdminToken(req, bodyToken)
  if (!token || token !== ADMIN) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 403 }) }
  }
  return { ok: true as const }
}

async function readProjects() {
  return await readProjectsStorage()
}

async function writeProjects(data: any[]) {
  return await writeProjectsStorage(data)
}

export async function GET() {
  try {
    const items = await readProjects()
    return NextResponse.json(items)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to read projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const auth = assertAdmin(req, body?.token)
    if (!auth.ok) return auth.res

    const section = body?.section ? String(body.section).trim() : "General"
    const title = body?.title ? String(body.title).trim() : "Untitled"
    const description = body?.description ? String(body.description).trim() : ""
    const link = body?.link ? String(body.link).trim() : ""
    const thumbnail = body?.thumbnail ? String(body.thumbnail).trim() : ""

    if (!link) {
      return NextResponse.json({ error: "Link is required" }, { status: 400 })
    }

    const items = await readProjects()
    const item = { id: Date.now(), section, title, description, link, thumbnail, createdAt: new Date().toISOString() }
    items.unshift(item)
    await writeProjects(items)
    return NextResponse.json(item, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save project" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = assertAdmin(req, body?.token)
    if (!auth.ok) return auth.res

    const id = body?.id
    if (id === undefined || id === null) return NextResponse.json({ error: "id is required" }, { status: 400 })
    const idNum = Number(id)
    const items = await readProjects()
    const idx = items.findIndex((it: any) => Number(it.id) === idNum)
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const section = body?.section ? String(body.section).trim() : items[idx].section
    const title = body?.title ? String(body.title).trim() : items[idx].title
    const description = body?.description ? String(body.description).trim() : items[idx].description
    const link = body?.link ? String(body.link).trim() : items[idx].link
    const thumbnail = body?.thumbnail ? String(body.thumbnail).trim() : items[idx].thumbnail || ""

    items[idx] = { ...items[idx], section, title, description, link, thumbnail, updatedAt: new Date().toISOString() }
    await writeProjects(items)
    return NextResponse.json(items[idx])
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const ADMIN = process.env.ADMIN_TOKEN || ""
    if (!ADMIN) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }
    const token = resolveAdminToken(req, body?.token)
    if (!token || token !== ADMIN) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing admin token. Please log in again." }, { status: 403 })
    }

    const id = body?.id

    if (id === undefined || id === null) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const items = await readProjects()

    const idNum = Number(id)
    const filtered = items.filter((it: any) => {
      const itIdNum = Number(it.id)
      return itIdNum !== idNum
    })

    if (filtered.length === items.length) {
      return NextResponse.json({ error: `Project with id ${id} not found` }, { status: 404 })
    }

    await writeProjects(filtered)
    return NextResponse.json({ ok: true, deletedId: id })
  } catch (err: any) {
    console.error("Delete project error:", err)
    return NextResponse.json({ error: err?.message || "Failed to delete project" }, { status: 500 })
  }
}
