"use client"
import React, { useEffect, useState } from "react"

type Project = { id: number; section: string; title: string; description: string; link: string; thumbnail?: string; createdAt: string }

const SECTIONS = [
  "Video Editing",
  "Color Grading",
  "Special FX Editing",
  "Documentary Editing",
  "Reel Editing",
  "Advertisement",
  "AI Video Generation",
  "Adobe Photoshop",
  "Banner Posters & Thumbnails",
  "Web Development",
]

function getDrivePreview(link: string) {
  try {
    const l = String(link || "").trim()
    // YouTube handling
    const yt = l.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{6,})/)
    if (yt && yt[1]) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&autoplay=1`

    // Attempt to extract Google Drive file id (supports several common patterns)
    const m = l.match(/(?:\/file\/d\/|open\?id=|uc\?id=|\/d\/|id=)([a-zA-Z0-9_-]{7,})/)
    if (m && m[1]) return `https://drive.google.com/file/d/${m[1]}/preview`

    // fallback: if link already looks like a preview or an embeddable video
    if (l.includes("drive.google.com") || l.includes("youtube.com") || l.includes("youtu.be")) return l
    // otherwise, return as-is
    return l
  } catch (e) {
    return link
  }
}

export default function WorkGallery() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminToken, setAdminToken] = useState("")
  const [form, setForm] = useState({ section: SECTIONS[0], title: "", description: "", link: "", thumbnail: "" })
  const [playing, setPlaying] = useState<Record<number, boolean>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [fullScreenId, setFullScreenId] = useState<number | null>(null)
  const [fullScreenUrl, setFullScreenUrl] = useState<string>("")

  useEffect(() => {
    fetchList()
    checkAdmin()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeFullscreen()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function openFullscreen(it: Project) {
    let url = getDrivePreview(it.link)
    // ensure YouTube plays with autoplay in fullscreen
    if (url.includes("youtube.com/embed") && !url.includes("autoplay")) {
      url += (url.includes("?") ? "&" : "?") + "autoplay=1"
    }
    setFullScreenId(it.id)
    setFullScreenUrl(url)
    setPlaying(prev => ({ ...prev, [it.id]: true }))
  }

  function closeFullscreen() {
    setFullScreenId(null)
    setFullScreenUrl("")
  }

  async function fetchList() {
    setLoading(true)
    try {
      const res = await fetch("/api/projects")
      if (!res.ok) return
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function checkAdmin() {
    try {
      const res = await fetch("/api/admin/status", { credentials: "include" })
      if (!res.ok) return
      const data = await res.json()
      setIsAdmin(Boolean(data?.admin))
    } catch (e) {
      console.error(e)
    }
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        // update existing
        const res = await fetch("/api/projects", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...form, token: adminToken }) })
        if (res.ok) {
          const updated = await res.json()
          setItems(prev => prev.map(it => it.id === updated.id ? updated : it))
          setEditingId(null)
          setForm({ section: SECTIONS[0], title: "", description: "", link: "", thumbnail: "" })
        } else {
          const err = await res.json()
          alert(err?.error || "Failed to update")
        }
      } else {
        const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
        if (res.ok) {
          const created = await res.json()
          setItems(prev => [created, ...prev])
          setForm({ section: SECTIONS[0], title: "", description: "", link: "", thumbnail: "" })
        } else {
          const err = await res.json()
          alert(err?.error || "Failed to add project")
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  function startEdit(it: Project) {
    setEditingId(it.id)
    setForm({ section: it.section, title: it.title, description: it.description, link: it.link, thumbnail: it.thumbnail || "" })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm({ section: SECTIONS[0], title: "", description: "", link: "", thumbnail: "" })
  }

  async function doDelete(id: number) {
    if (!confirm("Delete project?")) return
    try {
      // build headers and body including admin token when available so server can authenticate in one request
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (adminToken) headers['x-admin-token'] = adminToken
      const bodyPayload: any = { id }
      if (adminToken) bodyPayload.token = adminToken

      let res = await fetch("/api/projects", { method: "DELETE", headers, body: JSON.stringify(bodyPayload), credentials: "include" })
      if (res.status === 403 && adminToken) {
        res = await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-token": adminToken }, body: JSON.stringify({ id }) })
      }
      if (res.ok) {
        setItems(prev => prev.filter(it => it.id !== id))
      } else {
        const e = await res.json()
        alert(e?.error || "Failed to delete")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const visibleSections = ["All", ...SECTIONS]

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-black">View My Work</h1>
          <div>
            {isAdmin ? (
              <button onClick={async () => { await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }); setIsAdmin(false); setAdminToken(''); cancelEdit() }} className="rounded border px-3 py-1">Logout</button>
            ) : (
              <button onClick={async () => { const t = window.prompt('Enter admin token'); if (!t) return; const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: t }), credentials: 'include' }); if (res.ok) { setIsAdmin(true); setAdminToken(t) } else { alert('Invalid token') } }} className="rounded border px-3 py-1">Admin Login</button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {visibleSections.map(s => (
            <button key={s} onClick={() => setSelectedCategory(s)} className={`px-3 py-1 rounded ${selectedCategory === s ? 'bg-primary text-primary-foreground' : 'border'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Admin form (create / edit) */}
        {isAdmin && (
          <form onSubmit={submitForm} className="mb-6 rounded-lg p-4 border border-border bg-card">
            <div className="grid md:grid-cols-3 gap-3">
              <select value={form.section} onChange={e => setForm(prev => ({ ...prev, section: e.target.value }))} className="rounded border px-3 py-2">
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Title" className="rounded border px-3 py-2" />
              <input value={form.link} onChange={e => setForm(prev => ({ ...prev, link: e.target.value }))} placeholder="Google Drive link (required)" className="rounded border px-3 py-2" />
            </div>
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <input value={form.thumbnail} onChange={e => setForm(prev => ({ ...prev, thumbnail: e.target.value }))} placeholder="Thumbnail URL (optional)" className="rounded border px-3 py-2" />
              <input value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Short description" className="rounded border px-3 py-2" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button type="submit" className="rounded bg-slate-900 text-white px-4 py-2">{editingId ? 'Save Changes' : 'Add Project'}</button>
              {editingId && <button type="button" onClick={cancelEdit} className="rounded border px-3 py-2">Cancel</button>}
            </div>
          </form>
        )}

        {loading && <p>Loading...</p>}

        {/* Category sections - hide if no items in the selected category */}
        {visibleSections.filter(s => s === 'All' ? true : items.some(it => it.section === s)).map(section => (
          // if a specific category is selected, only render that one
          (selectedCategory === 'All' || selectedCategory === section) && (
            <div key={section} className="mb-10">
              <h2 className="text-xl font-semibold mb-4">{section}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {items.filter(it => (section === 'All' ? true : it.section === section)).map(it => (
                  <div key={it.id} className="rounded-lg overflow-hidden shadow-lg bg-white border group hover-lift card-glow transition-transform transform hover:scale-[1.02]">
                    <div className="relative">
                      {!playing[it.id] && (
                        <div className="relative">
                          <img src={it.thumbnail || '/placeholder.png'} alt={it.title} className="w-full h-40 sm:h-48 object-cover" />

                          {/* central play button */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <button onClick={(e) => { e.stopPropagation(); setPlaying(prev => ({ ...prev, [it.id]: true })) }} className="pointer-events-auto w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center text-2xl">▶</button>
                          </div>

                          {/* desktop quick actions (appear on hover) */}
                          <div className="absolute top-2 right-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition gap-2">
                            <button onClick={(e) => { e.stopPropagation(); openFullscreen(it) }} aria-label="Open fullscreen" className="p-2 bg-black/60 rounded text-white">⤢</button>
                            <a onClick={e => e.stopPropagation()} href={getDrivePreview(it.link)} target="_blank" rel="noreferrer" className="p-2 bg-black/60 rounded text-white">↗</a>
                          </div>

                          {/* mobile quick actions (stacked below image) */}
                          <div className="mt-2 sm:hidden flex items-center gap-3 px-3">
                            <button onClick={(e) => { e.stopPropagation(); openFullscreen(it) }} aria-label="Open fullscreen" className="p-3 bg-black/60 rounded text-white">⤢</button>
                            <a onClick={e => e.stopPropagation()} href={getDrivePreview(it.link)} target="_blank" rel="noreferrer" className="p-3 bg-black/60 rounded text-white">↗</a>
                            <button onClick={(e) => { e.stopPropagation(); setPlaying(prev => ({ ...prev, [it.id]: true })) }} className="ml-auto px-4 py-2 rounded bg-primary/10 text-sm">Play</button>
                          </div>
                        </div>
                      )}

                      {playing[it.id] && (
                        <div className="w-full relative bg-black aspect-video">
                          <iframe src={getDrivePreview(it.link)} className="w-full h-full" frameBorder={0} allow="autoplay; fullscreen; encrypted-media" allowFullScreen title={it.title} />

                          {/* desktop playback controls */}
                          <div className="absolute top-2 right-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition gap-2">
                            <button onClick={(e) => { e.stopPropagation(); openFullscreen(it) }} aria-label="Open fullscreen" className="p-2 bg-black/60 rounded text-white">⤢</button>
                            <button onClick={(e) => { e.stopPropagation(); setPlaying(prev => ({ ...prev, [it.id]: false })) }} aria-label="Pause" className="p-2 bg-black/60 rounded text-white">⏸</button>
                          </div>

                          {/* mobile playback controls below */}
                          <div className="mt-2 sm:hidden flex items-center gap-3 px-3">
                            <button onClick={(e) => { e.stopPropagation(); openFullscreen(it) }} aria-label="Open fullscreen" className="p-3 bg-black/60 rounded text-white">⤢</button>
                            <button onClick={(e) => { e.stopPropagation(); setPlaying(prev => ({ ...prev, [it.id]: false })) }} aria-label="Pause" className="p-3 bg-black/60 rounded text-white">⏸</button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{it.title}</h3>
                        <div className="text-xs text-slate-500">{new Date(it.createdAt).toLocaleDateString()}</div>
                      </div>
                      <p className="text-sm sm:text-base text-slate-700 mb-3">{it.description}</p>
                      <div className="flex items-center gap-2">
                        {isAdmin && <button onClick={(e) => { e.stopPropagation(); doDelete(it.id) }} className="text-sm text-red-600">Delete</button>}
                        {isAdmin && <button onClick={(e) => { e.stopPropagation(); startEdit(it) }} className="text-sm text-primary">Edit</button>}
                        <a className="text-sm text-primary" href={getDrivePreview(it.link)} target="_blank" rel="noreferrer">Open in new tab</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Fullscreen modal */}
        {fullScreenId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => closeFullscreen()}>
            <div className="relative w-full max-w-5xl mx-4 aspect-video">
              <iframe src={fullScreenUrl} className="w-full h-full" frameBorder={0} allow="autoplay; fullscreen; encrypted-media" allowFullScreen title="Full screen player" />
              <button onClick={(e) => { e.stopPropagation(); closeFullscreen() }} className="absolute top-2 right-2 p-2 rounded bg-white/10 text-white">✕</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

