"use client"
import React, { useEffect, useState } from "react"
import { toast } from '@/hooks/use-toast' 

type Reply = { id: number; name: string; message: string; createdAt: string }

type Testimonial = {
  id: number
  name: string
  message: string
  rating: number | null
  createdAt: string
  replies?: Reply[]
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState<number | "">("")
  const [loading, setLoading] = useState(false)
  const [replyOpen, setReplyOpen] = useState<Record<number, boolean>>({})
  const [replyText, setReplyText] = useState<Record<number, string>>({})
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchList()
    checkAdmin()
  }, [])

  async function checkAdmin() {
    try {
      const res = await fetch("/api/admin/status", { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setIsAdmin(Boolean(data?.admin))
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchList() {
    try {
      const res = await fetch("/api/testimonials")
      if (!res.ok) return
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) return toast({ title: 'Message required', description: 'Please enter your testimonial', variant: 'destructive' })
    if (trimmed.length < 10) return toast({ title: 'Too short', description: 'Please add a longer message (min 10 characters)', variant: 'destructive' })

    setLoading(true)
    try {
      const body = { name: name.trim() || undefined, message: trimmed, rating: rating === "" ? undefined : Number(rating) }
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const text = await res.text().catch(() => '')
      let payload: any = {}
      try { payload = text ? JSON.parse(text) : {} } catch (err) { payload = { raw: text } }

      if (res.ok) {
        const created = payload
        setItems(prev => [created, ...prev])
        setName("")
        setMessage("")
        setRating("")
        toast({ title: 'Thanks!', description: 'Your testimonial was submitted.' })
      } else {
        console.error("Submit error", res.status, payload)
        const msg = payload?.error || payload?.message || payload?.raw || 'Please try again'
        toast({ title: `Failed to submit (${res.status})`, description: msg, variant: 'destructive' })
      }
    } catch (e: any) {
      console.error(e)
      toast({ title: 'Failed to submit', description: e?.message || 'Network error. Please try again', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  function renderStars(r: number | null) {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= (r || 0) ? "text-yellow-500" : "text-slate-300"}>
          ★
        </span>
      )
    }
    return <span className="text-lg">{stars}</span>
  }

  async function submitReply(id: number) {
    const text = (replyText[id] || "").trim()
    if (!text) return
    try {
      const res = await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", id, reply: text, name: "Owner" }),
      })
      if (res.ok) {
        const updated = await res.json()
        setItems(prev => prev.map(it => (it.id === updated.id ? updated : it)))
        setReplyText(prev => ({ ...prev, [id]: "" }))
        setReplyOpen(prev => ({ ...prev, [id]: false }))
        toast({ title: 'Reply sent', description: 'Your reply was added.' })
      } else {
        const err = await res.json()
        console.error(err)
        toast({ title: 'Failed to send reply', description: err?.error || 'Please try again', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(id: number) {
    if (!isAdmin) {
      window.alert("Admin not logged in")
      return
    }
    if (!window.confirm("Delete testimonial? This cannot be undone.")) return
    try {
      const res = await fetch("/api/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        credentials: 'include',
      })
      if (res.ok) {
        setItems(prev => prev.filter(it => it.id !== id))
        toast({ title: 'Deleted', description: 'Testimonial removed.' })
      } else {
        const e = await res.json()
        toast({ title: 'Failed to delete', description: e?.error || 'Please try again', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section id="testimonials" className="my-16 px-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Testimonials & Advice</h2>
        <div>
          {isAdmin ? (
            <button onClick={async () => { await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }); setIsAdmin(false) }} className="text-sm rounded px-3 py-1 btn-dark-sm">Admin Logout</button>
          ) : (
            <button onClick={async () => { const t = window.prompt('Enter admin token'); if (!t) return; const res = await fetch('/api/admin/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: t }) }); if (res.ok) { await checkAdmin() } else { alert('Invalid token') } }} className="text-sm rounded px-3 py-1 btn-dark-sm">Admin Login</button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full rounded border px-3 py-2"
        />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Share advice, feedback or a short testimonial"
          className="w-full rounded border px-3 py-2 h-24"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="text-sm">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                className={"text-2xl " + (i <= (rating === "" ? 0 : Number(rating)) ? "text-yellow-400" : "text-slate-300")}
                aria-label={String(i)}
              >
                ★
              </button>
            ))}
          </div>
          <button type="submit" disabled={loading} className="sm:ml-auto w-full sm:w-auto rounded btn-dark px-4 py-2">
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {items.length === 0 && <p className="text-sm text-slate-600">No testimonials yet — be the first!</p>}
        {items.map(it => (
          <div key={it.id} className="border rounded-lg p-3 sm:p-4 shadow-sm bg-white">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-medium">{it.name || "Anonymous"}</div>
                <div className="text-xs text-slate-500">{new Date(it.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(it.rating ?? null)}
                <button onClick={() => setReplyOpen(prev => ({ ...prev, [it.id]: !prev[it.id] }))} className="text-sm text-slate-600">Reply</button>
                {isAdmin && <button onClick={() => handleDelete(it.id)} className="text-sm text-red-600">Delete</button>}
              </div>
            </div>
            <div className="mb-2 text-sm">{it.message}</div>

            {it.replies && it.replies.length > 0 && (
              <div className="mt-3 space-y-2">
                {it.replies.map(r => (
                  <div key={r.id} className="border-l-2 border-slate-100 pl-3 text-sm">
                    <div className="text-xs font-medium">{r.name} <span className="text-slate-400">• {new Date(r.createdAt).toLocaleString()}</span></div>
                    <div className="text-sm">{r.message}</div>
                  </div>
                ))}
              </div>
            )}

            {replyOpen[it.id] && (
              <div className="mt-3">
                <textarea value={replyText[it.id] || ""} onChange={e => setReplyText(prev => ({ ...prev, [it.id]: e.target.value }))} className="w-full rounded border px-3 py-2 h-20 mb-2" placeholder="Write a reply" />
                <div className="flex gap-2">
                  <button onClick={() => submitReply(it.id)} className="rounded btn-dark-sm text-white px-3 py-1 text-sm">Send Reply</button>
                  <button onClick={() => setReplyOpen(prev => ({ ...prev, [it.id]: false }))} className="rounded border px-3 py-1 text-sm">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
