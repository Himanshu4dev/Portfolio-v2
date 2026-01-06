"use client"
import React, { useEffect, useState } from "react"
import { toast } from '@/hooks/use-toast' 
import LoadingSpinner from '@/components/ui/loading-spinner'
import { useScrollReveal } from '@/hooks/useScrollReveal'

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
    if (!tokenInput.trim()) {
      toast({ title: 'Error', description: 'Please enter admin token', variant: 'destructive' })
      return
    }
    setLoading(true)
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
      toast({ title: 'Login Error', description: 'Network error occurred', variant: 'destructive' })
    } finally {
      setLoading(false)
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
    setLoading(true)
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
      toast({ title: 'Delete Error', description: 'Network error occurred', variant: 'destructive' })
    } finally {
      setLoading(false)
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 reveal" ref={useScrollReveal<HTMLDivElement>()}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Admin — Testimonials</h1>
        <div>
          {isAdmin ? (
            <button onClick={logout} className="px-3 py-2 rounded btn-dark-sm font-semibold hover-lift btn-interactive">Logout</button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                value={tokenInput} 
                onChange={e => setTokenInput(e.target.value)} 
                placeholder="Admin token" 
                className="rounded border px-3 py-2 w-full sm:w-auto" 
              />
              <button 
                onClick={login} 
                disabled={loading}
                className="px-3 py-2 rounded btn-dark-sm font-semibold hover-lift btn-interactive disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <LoadingSpinner size="sm" />}
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      {!isAdmin && <p className="text-sm text-slate-600">Please login as admin to manage testimonials.</p>}

      {isAdmin && (
        <div>
          <div className="mb-4">
            <button onClick={fetchList} className="px-4 py-2 rounded btn-dark-sm font-semibold hover-lift btn-interactive">Refresh</button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" className="mr-3" />
              <span>Loading testimonials...</span>
            </div>
          )}
          {!loading && items.length === 0 && <p>No testimonials yet.</p>}

          <div className="space-y-4">
            {items.map(it => (
              <div key={it.id} className="border rounded-lg p-4 sm:p-6 card-hover reveal" ref={useScrollReveal<HTMLDivElement>()}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">{it.name || "Anonymous"}</div>
                    <div className="text-xs text-slate-500">{new Date(it.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-yellow-500">{Array.from({ length: 5 }).map((_, i) => (<span key={i}>{i < (it.rating || 0) ? '★' : '☆'}</span>))}</div>
                    <button 
                      onClick={() => doDelete(it.id)} 
                      disabled={loading}
                      className="text-sm text-red-600 hover:text-red-700 font-medium btn-interactive px-2 py-1 rounded disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading && <LoadingSpinner size="sm" />}
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mb-3 text-sm leading-relaxed">{it.message}</div>

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

                <div className="mt-4">
                  <textarea 
                    value={replyText[it.id] || ""} 
                    onChange={e => setReplyText(prev => ({ ...prev, [it.id]: e.target.value }))} 
                    className="w-full rounded border px-3 py-2 h-20 mb-3 resize-none focus:ring-2 focus:ring-primary/20" 
                    placeholder="Write a reply" 
                  />
                  <div>
                    <button 
                      onClick={() => sendReply(it.id)} 
                      className="px-4 py-2 rounded btn-dark-sm font-semibold hover-lift btn-interactive"
                    >
                      Send Reply
                    </button>
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
