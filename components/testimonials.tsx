"use client"
import React, { useEffect, useState } from "react"

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
    if (!message.trim()) return
    setLoading(true)
    try {
      const body = { name: name.trim() || undefined, message: message.trim(), rating: rating === "" ? undefined : Number(rating) }
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const created = await res.json()
        setItems(prev => [created, ...prev])
        setName("")
        setMessage("")
        setRating("")
      } else {
        const err = await res.json()
        console.error("Submit error", err)
      }
    } catch (e) {
      console.error(e)
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
      } else {
        console.error(await res.json())
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
        credentials: 'include'
      })
      if (res.ok) {
        setItems(prev => prev.filter(it => it.id !== id))
      } else {
        const e = await res.json()
        alert(e?.error || "Failed to delete. Make sure you're logged in as admin.")
      }
    } catch (e) {
      console.error(e)
      alert("Failed to delete testimonial")
    }
  }

  return (
    <section id="testimonials" className="my-12 sm:my-16 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight">Testimonials & Advice</h2>
        <div className="flex-shrink-0">
          {isAdmin ? (
            <button 
              onClick={async () => { 
                await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }); 
                setIsAdmin(false);
                await checkAdmin();
              }} 
              className="text-xs sm:text-sm rounded border px-3 py-1.5 hover:bg-slate-100 transition-colors touch-manipulation"
            >
              Admin Logout
            </button>
          ) : (
            <button 
              onClick={async () => { 
                const t = window.prompt('Enter admin token'); 
                if (!t) return; 
                const res = await fetch('/api/admin/login', { 
                  method: 'POST', 
                  headers: { 'Content-Type': 'application/json' }, 
                  body: JSON.stringify({ token: t }), 
                  credentials: 'include' 
                }); 
                if (res.ok) { 
                  setIsAdmin(true);
                  await checkAdmin();
                } else { 
                  alert('Invalid token') 
                } 
              }} 
              className="text-xs sm:text-sm rounded border px-3 py-1.5 hover:bg-slate-100 transition-colors touch-manipulation"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full rounded border px-4 py-3 text-base min-h-[44px]"
        />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Share advice, feedback or a short testimonial"
          className="w-full rounded border px-4 py-3 h-28 sm:h-32 text-base resize-none min-h-[120px]"
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm sm:text-base whitespace-nowrap font-medium">Rating</label>
            <div className="flex items-center gap-1 sm:gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  className={"text-2xl sm:text-3xl touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center " + (i <= (rating === "" ? 0 : Number(rating)) ? "text-yellow-400" : "text-slate-300")}
                  aria-label={String(i)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="sm:ml-auto rounded bg-slate-900 text-white px-6 py-3 text-base font-semibold touch-manipulation w-full sm:w-auto min-h-[44px]">
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>

      <div className="space-y-4 sm:space-y-5">
        {items.length === 0 && <p className="text-sm sm:text-base text-slate-600 text-center py-4">No testimonials yet — be the first!</p>}
        {items.map(it => (
          <div key={it.id} className="border rounded-lg p-4 sm:p-5 shadow-sm bg-white">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-medium break-words mb-1">{it.name || "Anonymous"}</div>
                <div className="text-xs sm:text-sm text-slate-500">{new Date(it.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-shrink-0">{renderStars(it.rating ?? null)}</div>
                <button onClick={() => setReplyOpen(prev => ({ ...prev, [it.id]: !prev[it.id] }))} className="text-sm sm:text-base text-slate-600 hover:text-slate-800 touch-manipulation py-2 px-3 min-h-[44px] rounded border border-slate-200 hover:bg-slate-50">Reply</button>
                {isAdmin && <button onClick={() => handleDelete(it.id)} className="text-sm sm:text-base text-red-600 hover:text-red-800 font-medium touch-manipulation py-2 px-3 min-h-[44px] rounded border border-red-200 hover:bg-red-50">Delete</button>}
              </div>
            </div>
            <div className="mb-3 text-sm sm:text-base break-words leading-relaxed">{it.message}</div>

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
              <div className="mt-4 pt-4 border-t border-slate-200">
                <textarea value={replyText[it.id] || ""} onChange={e => setReplyText(prev => ({ ...prev, [it.id]: e.target.value }))} className="w-full rounded border px-4 py-3 h-24 mb-3 text-base resize-none min-h-[100px]" placeholder="Write a reply" />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button onClick={() => submitReply(it.id)} className="rounded bg-slate-900 text-white px-6 py-3 text-base font-semibold touch-manipulation w-full sm:w-auto min-h-[44px]">Send Reply</button>
                  <button onClick={() => setReplyOpen(prev => ({ ...prev, [it.id]: false }))} className="rounded border px-6 py-3 text-base font-semibold touch-manipulation w-full sm:w-auto min-h-[44px]">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
