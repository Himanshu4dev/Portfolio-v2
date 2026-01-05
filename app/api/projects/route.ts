import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "tmp")
const DATA_FILE = path.join(DATA_DIR, "projects.json")

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_FILE)
  } catch (e) {
    await fs.writeFile(DATA_FILE, JSON.stringify([]), "utf8")
  }
}

async function readProjects() {
  await ensureDataFile()
  const txt = await fs.readFile(DATA_FILE, "utf8")
  try {
    const data = JSON.parse(txt || "[]")
    return Array.isArray(data) ? data : []
  } catch (e) {
    return []
  }
}

async function writeProjects(data: any[]) {
  await ensureDataFile()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8")
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
    const tokenHeader = req.headers.get("x-admin-token")
    const body = await req.json().catch(() => ({}))
    const tokenBody = body?.token
    const cookieHeader = req.headers.get("cookie") || ""
    const cookieToken = cookieHeader.split(";").map(s => s.trim()).find(s => s.startsWith("admin_session="))?.split("=")[1]
    const token = tokenHeader || tokenBody || cookieToken
    const ADMIN = process.env.ADMIN_TOKEN || ""
    if (!ADMIN || !token || token !== ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = body?.id
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })
    const items = await readProjects()
    const idx = items.findIndex((it: any) => it.id === id)
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
    const tokenHeader = req.headers.get("x-admin-token")
    const tokenBody = body?.token
    // also accept Authorization: Bearer <token>
    const authHeader = req.headers.get("authorization")
    const headerToken = authHeader ? authHeader.replace(/^Bearer\s+/i, "") : undefined

    // Improved cookie parsing
    const cookieHeader = req.headers.get("cookie") || ""
    let cookieToken: string | undefined
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map(s => s.trim())
      const adminCookie = cookies.find(s => s.startsWith("admin_session="))
      if (adminCookie) {
        cookieToken = adminCookie.split("=").slice(1).join("=") // Handle values with = in them
      }
    }

    const token = tokenHeader || tokenBody || cookieToken || headerToken
    const ADMIN = process.env.ADMIN_TOKEN || ""

    console.log("DELETE request - Admin check:", {
      hasAdminToken: !!ADMIN,
      hasCookieToken: !!cookieToken,
      cookieHeader: cookieHeader.substring(0, 50) + "...",
      hasHeaderToken: !!tokenHeader,
      hasAuthHeader: !!authHeader,
      hasBodyToken: !!tokenBody,
      tokenMatch: token === ADMIN,
      tokenLength: token?.length,
      adminLength: ADMIN.length
    })
    
    if (!ADMIN) {
      console.error("ADMIN_TOKEN not set in environment")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }
    
    if (!token || token !== ADMIN) {
      console.error("Authentication failed:", { 
        tokenProvided: !!token, 
        tokenLength: token?.length,
        adminLength: ADMIN.length,
        tokensMatch: token === ADMIN,
        cookieToken: cookieToken?.substring(0, 10) + "..."
      })
      return NextResponse.json({ error: "Unauthorized - Invalid or missing admin token. Please log in again." }, { status: 403 })
    }

    const id = body?.id
    console.log("Delete request for ID:", id, "Type:", typeof id)
    
    if (id === undefined || id === null) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }
    
    const items = await readProjects()
    console.log("Current projects:", items.length, "IDs:", items.map((it: any) => ({ id: it.id, type: typeof it.id })))
    
    // Convert both to numbers for comparison to handle type mismatches
    const idNum = Number(id)
    const filtered = items.filter((it: any) => {
      const itIdNum = Number(it.id)
      return itIdNum !== idNum
    })
    
    console.log("After filter:", filtered.length, "items remaining")
    
    if (filtered.length === items.length) {
      return NextResponse.json({ error: `Project with id ${id} not found` }, { status: 404 })
    }
    
    await writeProjects(filtered)
    console.log("Project deleted successfully, remaining:", filtered.length)
    return NextResponse.json({ ok: true, deletedId: id })
  } catch (err: any) {
    console.error("Delete project error:", err)
    return NextResponse.json({ error: err?.message || "Failed to delete project" }, { status: 500 })
  }
}
