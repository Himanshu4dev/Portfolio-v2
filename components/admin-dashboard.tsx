"use client"
import React, { useEffect, useState } from "react"
import { toast } from '@/hooks/use-toast' 

type Reply = { id: number; name: string; message: string; createdAt: string }
type Testimonial = { id: number; name: string; message: string; rating: number | null; createdAt: string; replies?: Reply[] }

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [tokenInput, setTokenInput] = useState("")
  const [adminToken, setAdminToken] = useState("")
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(false)
  const [replyText, setReplyText] = useState<Record<number, string>>({})

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    try {
      const res = await fetch("/api/admin/status", { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setIsAdmin(Boolean(data?.admin))
      if (data?.admin) fetchList()
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchList() {
    setLoading(true)
    try {
      const res = await fetch("/api/testimonials")
      if (!res.ok) return
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function login() {
    if (!tokenInput.trim()) return alert("Enter token")
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: tokenInput.trim() }), credentials: 'include' })
      if (res.ok) {
        setIsAdmin(true)
        setAdminToken(tokenInput.trim())
        setTokenInput("")
        fetchList()
        toast({ title: 'Admin login', description: 'You are now logged in.' })
      } else {
        toast({ title: 'Invalid token', description: 'Login failed', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: 'include' })
    setIsAdmin(false)
    setItems([])
    toast({ title: 'Logged out', description: 'Admin session ended.' })
  }

  async function doDelete(id: number) {
    if (!confirm("Delete testimonial? This cannot be undone.")) return
    try {
      let res = await fetch("/api/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }), credentials: 'include' })
      if (res.status === 403 && adminToken) {
        // retry with header token if cookie auth failed
        res = await fetch("/api/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-token": adminToken }, body: JSON.stringify({ id }) })
        if (res.status === 403) {
          res = await fetch("/api/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${adminToken}` }, body: JSON.stringify({ id }) })
        }
      }
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

  async function sendReply(id: number) {
    const text = (replyText[id] || "").trim()
    if (!text) return
    try {
      const res = await fetch("/api/testimonials", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reply", id, reply: text, name: "Owner" }) })
      if (res.ok) {
        const updated = await res.json()
        setItems(prev => prev.map(it => (it.id === updated.id ? updated : it)))
        setReplyText(prev => ({ ...prev, [id]: "" }))
        toast({ title: 'Reply sent', description: 'Reply posted.' })
      } else {
        const err = await res.json()
        console.error(err)
        toast({ title: 'Failed to send reply', description: err?.error || 'Please try again', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin — Testimonials</h1>
        <div>
          {isAdmin ? (
            <button onClick={logout} className="px-3 py-1 rounded btn-dark-sm font-semibold hover-lift">Logout</button>
          ) : (
            <div className="flex gap-2">
              <input value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Admin token" className="rounded border px-2 py-1" />
              <button onClick={login} className="px-3 py-1 rounded btn-dark-sm font-semibold hover-lift">Login</button>
            </div>
          )}
        </div>
      </div>

      {!isAdmin && <p className="text-sm text-slate-600">Please login as admin to manage testimonials.</p>}

      {isAdmin && (
        <div>
          <div className="mb-4">
            <button onClick={fetchList} className="px-3 py-1 rounded btn-dark-sm font-semibold hover-lift">Refresh</button>
          </div>

          {loading && <p>Loading...</p>}
          {!loading && items.length === 0 && <p>No testimonials yet.</p>}

          <div className="space-y-4">
            {items.map(it => (
              <div key={it.id} className="border rounded p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium">{it.name || "Anonymous"}</div>
                    <div className="text-xs text-slate-500">{new Date(it.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-yellow-500">{Array.from({ length: 5 }).map((_, i) => (<span key={i}>{i < (it.rating || 0) ? '★' : '☆'}</span>))}</div>
                    <button onClick={() => doDelete(it.id)} className="text-sm text-red-600">Delete</button>
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

                <div className="mt-3">
                  <textarea value={replyText[it.id] || ""} onChange={e => setReplyText(prev => ({ ...prev, [it.id]: e.target.value }))} className="w-full rounded border px-3 py-2 h-20 mb-2" placeholder="Write a reply" />
                  <div>
                    <button onClick={() => sendReply(it.id)} className="px-3 py-1 rounded btn-dark-sm font-semibold hover-lift">Send Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
