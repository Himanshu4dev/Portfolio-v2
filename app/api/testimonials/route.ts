import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

import { readTestimonialsStorage, writeTestimonialsStorage } from '@/lib/storage'

async function readTestimonials() {
  return await readTestimonialsStorage()
}

async function writeTestimonials(data: any[]) {
  return await writeTestimonialsStorage(data)
}

export async function GET() {
  try {
    const items = await readTestimonials()
    return NextResponse.json(items)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to read testimonials" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = body?.name ? String(body.name).trim() : "Anonymous"
    const message = body?.message ? String(body.message).trim() : ""
    const rating = body?.rating ? Number(body.rating) : null

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (rating !== null && (Number.isNaN(rating) || rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5" }, { status: 400 })
    }

    const items = await readTestimonials()
    const item = {
      id: Date.now(),
      name,
      message,
      rating: rating ?? null,
      replies: [],
      createdAt: new Date().toISOString(),
    }
    items.unshift(item)
    await writeTestimonials(items)
    return NextResponse.json(item, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save testimonial" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const action = body?.action
    if (action === "reply") {
      const id = body?.id
      const replyText = body?.reply ? String(body.reply).trim() : ""
      const name = body?.name ? String(body.name).trim() : "Anonymous"
      if (!id || !replyText) {
        return NextResponse.json({ error: "id and reply are required" }, { status: 400 })
      }
      const items = await readTestimonials()
      const idx = items.findIndex((it: any) => it.id === id)
      if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
      const reply = { id: Date.now(), name, message: replyText, createdAt: new Date().toISOString() }
      items[idx].replies = items[idx].replies || []
      items[idx].replies.push(reply)
      await writeTestimonials(items)
      return NextResponse.json(items[idx])
    }
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to patch testimonial" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const tokenHeader = req.headers.get("x-admin-token")
    const tokenBody = body?.token

    // parse cookie token if present (support cookie based admin session)
    const cookieHeader = req.headers.get("cookie") || ""
    let cookieToken: string | undefined
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map(s => s.trim())
      const adminCookie = cookies.find(s => s.startsWith("admin_session="))
      if (adminCookie) {
        cookieToken = adminCookie.split("=").slice(1).join("=")
      }
    }

    const token = tokenHeader || tokenBody || cookieToken
    const ADMIN = process.env.ADMIN_TOKEN || ""

    if (!ADMIN || !token || token !== ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = body?.id
    if (id === undefined || id === null) return NextResponse.json({ error: "id is required" }, { status: 400 })

    const items = await readTestimonials()
    // normalize id types to avoid mismatches (numbers vs strings)
    const idNum = Number(id)
    const filtered = items.filter((it: any) => Number(it.id) !== idNum)

    if (filtered.length === items.length) {
      return NextResponse.json({ error: `Testimonial with id ${id} not found` }, { status: 404 })
    }

    await writeTestimonials(filtered)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to delete testimonial" }, { status: 500 })
  }
}
