"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"

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
  const [form, setForm] = useState({ section: SECTIONS[0], title: "", description: "", link: "", thumbnail: "" })
  const [playing, setPlaying] = useState<Record<number, boolean>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [fullScreenId, setFullScreenId] = useState<number | null>(null)
  const [fullScreenUrl, setFullScreenUrl] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest")

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
      if (!res.ok) {
        setIsAdmin(false)
        return
      }
      const data = await res.json()
      const adminStatus = Boolean(data?.admin)
      setIsAdmin(adminStatus)
      if (!adminStatus) {
        console.log("Not logged in as admin")
      }
    } catch (e) {
      console.error("Admin check error:", e)
      setIsAdmin(false)
    }
  }

  function getFilteredAndSortedItems() {
    let filtered = items

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(it => it.section === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(it => 
        it.title.toLowerCase().includes(query) ||
        it.description.toLowerCase().includes(query) ||
        it.section.toLowerCase().includes(query)
      )
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        return a.title.localeCompare(b.title)
      }
    })

    return sorted
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId) {
        // update existing
        const res = await fetch("/api/projects", { 
          method: "PATCH", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ id: editingId, ...form }),
          credentials: "include"
        })
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
          alert(err?.error || "Failed to add")
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
    console.log("doDelete called with ID:", id, "Type:", typeof id, "isAdmin:", isAdmin)
    
    if (!confirm("Delete project? This cannot be undone.")) return
    
    // Double check admin status before attempting delete
    if (!isAdmin) {
      alert("You must be logged in as admin to delete projects.")
      // Re-check admin status
      const adminCheck = await fetch("/api/admin/status", { credentials: "include" })
      const adminData = await adminCheck.json()
      console.log("Re-checked admin status:", adminData)
      if (!adminData?.admin) {
        alert("Please log in as admin first.")
        return
      }
      setIsAdmin(true)
    }
    
    try {
      console.log("Sending DELETE request for ID:", id)
      const res = await fetch("/api/projects", { 
        method: "DELETE", 
        headers: { 
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({ id }), 
        credentials: "include" 
      })
      
      console.log("Delete response status:", res.status, res.statusText)
      
      let data = {}
      try {
        data = await res.json()
        console.log("Delete response data:", data)
      } catch (e) {
        console.error("Failed to parse response JSON:", e)
        const text = await res.text()
        console.error("Response text:", text)
      }
      
      if (res.ok) {
        console.log("Delete successful, updating UI")
        // Update local state immediately
        setItems(prev => {
          const filtered = prev.filter(it => it.id !== id)
          console.log("Items before:", prev.length, "Items after:", filtered.length)
          return filtered
        })
        // Also refresh from server to ensure sync
        await fetchList()
      } else {
        console.error("Delete failed:", res.status, data)
        alert(data?.error || `Failed to delete. Status: ${res.status}. Make sure you're logged in as admin.`)
      }
    } catch (e) {
      console.error("Delete error:", e)
      alert(`Failed to delete project: ${e instanceof Error ? e.message : 'Unknown error'}. Check console for details.`)
    }
  }

  const visibleSections = ["All", ...SECTIONS]

  return (
    <section className="py-6 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-black leading-tight">View My Work</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="rounded border px-4 py-2.5 text-sm sm:text-base min-h-[44px] flex items-center justify-center touch-manipulation">Home</Link>
            {isAdmin ? (
              <button onClick={async () => { 
                await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' }); 
                setIsAdmin(false); 
                cancelEdit();
                await checkAdmin();
              }} className="rounded border px-4 py-2.5 text-sm sm:text-base hover:bg-slate-100 transition-colors min-h-[44px] flex items-center justify-center touch-manipulation">Logout</button>
            ) : (
              <button onClick={async () => { 
                const t = window.prompt('Enter admin token'); 
                if (!t) return; 
                try {
                  const res = await fetch('/api/admin/login', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ token: t }), 
                    credentials: 'include' 
                  }); 
                  if (res.ok) { 
                    await checkAdmin(); // Verify admin status after login
                  } else { 
                    const err = await res.json().catch(() => ({}))
                    alert(err?.error || 'Invalid token') 
                  }
                } catch (e) {
                  console.error("Login error:", e)
                  alert('Failed to login. Check console for details.')
                }
              }} className="rounded border px-4 py-2.5 text-sm sm:text-base hover:bg-slate-100 transition-colors min-h-[44px] flex items-center justify-center touch-manipulation">Admin Login</button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="flex-1 rounded border px-4 py-3 text-base sm:text-base focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] w-full"
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as "newest" | "oldest" | "title")}
              className="rounded border px-4 py-3 text-base sm:text-base focus:outline-none focus:ring-2 focus:ring-primary min-w-full sm:min-w-[160px] min-h-[44px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
          
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {visibleSections.map(s => (
              <button 
                key={s} 
                onClick={() => setSelectedCategory(s)} 
                className={`px-3 sm:px-4 py-2.5 sm:py-2 rounded text-sm sm:text-sm transition-colors touch-manipulation min-h-[44px] flex items-center justify-center ${
                  selectedCategory === s 
                    ? 'bg-primary text-primary-foreground font-semibold' 
                    : 'border hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          
          {searchQuery && (
            <div className="text-sm text-slate-600">
              Found {getFilteredAndSortedItems().length} project{getFilteredAndSortedItems().length !== 1 ? 's' : ''} matching "{searchQuery}"
            </div>
          )}
        </div>

        {/* Admin form (create / edit) */}
        {isAdmin && (
          <form onSubmit={submitForm} className="mb-4 sm:mb-6 rounded-lg p-3 sm:p-4 border border-border bg-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <select value={form.section} onChange={e => setForm(prev => ({ ...prev, section: e.target.value }))} className="rounded border px-4 py-3 text-base min-h-[44px] w-full">
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Title" className="rounded border px-4 py-3 text-base min-h-[44px] w-full" />
              <input value={form.link} onChange={e => setForm(prev => ({ ...prev, link: e.target.value }))} placeholder="Drive link (required)" className="rounded border px-4 py-3 text-base min-h-[44px] w-full sm:col-span-2 md:col-span-1" />
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={form.thumbnail} onChange={e => setForm(prev => ({ ...prev, thumbnail: e.target.value }))} placeholder="Thumbnail URL (optional)" className="rounded border px-4 py-3 text-base min-h-[44px] w-full" />
              <input value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Short description" className="rounded border px-4 py-3 text-base min-h-[44px] w-full" />
            </div>
            <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button type="submit" className="rounded bg-slate-900 text-white px-6 py-3 text-base font-semibold touch-manipulation min-h-[44px] w-full sm:w-auto">{editingId ? 'Save Changes' : 'Add Project'}</button>
              {editingId && <button type="button" onClick={cancelEdit} className="rounded border px-6 py-3 text-base font-semibold touch-manipulation min-h-[44px] w-full sm:w-auto">Cancel</button>}
            </div>
          </form>
        )}

        {loading && <p>Loading...</p>}

        {/* Display filtered and sorted items */}
        {getFilteredAndSortedItems().length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg mb-2">No projects found</p>
            <p className="text-sm">
              {searchQuery ? "Try adjusting your search or filters" : isAdmin ? "Add your first project using the form above" : "Check back soon for new projects"}
            </p>
          </div>
        ) : (
          <div className="mb-10">
            {selectedCategory === 'All' ? (
              // Group by section when showing all
              visibleSections.filter(s => s === 'All' ? false : getFilteredAndSortedItems().some(it => it.section === s)).map(section => (
                <div key={section} className="mb-6 sm:mb-8 md:mb-10">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 px-1">{section}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 md:gap-6">
                    {getFilteredAndSortedItems().filter(it => it.section === section).map(it => (
                  <div key={it.id} className="rounded-lg overflow-hidden shadow-lg bg-white border group hover-lift card-glow transition-transform transform hover:scale-[1.02] active:scale-[0.98]">
                    <div className="relative">
                      {!playing[it.id] && (
                        <div className="relative">
                          <img src={it.thumbnail || '/placeholder.jpg'} alt={it.title} className="w-full h-48 sm:h-52 md:h-56 object-cover" />

                          {/* central play button */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <button onClick={(e) => { e.stopPropagation(); setPlaying(prev => ({ ...prev, [it.id]: true })) }} className="pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/70 text-white flex items-center justify-center text-2xl sm:text-3xl touch-manipulation active:scale-90 shadow-lg">▶</button>
                          </div>

                          {/* desktop quick actions (appear on hover) */}
                          <div className="absolute top-2 right-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition gap-2">
                            <button onClick={(e) => { e.stopPropagation(); openFullscreen(it) }} aria-label="Open fullscreen" className="p-2 bg-black/60 rounded text-white">⤢</button>
                            <a onClick={e => e.stopPropagation()} href={getDrivePreview(it.link)} target="_blank" rel="noreferrer" className="p-2 bg-black/60 rounded text-white">↗</a>
                          </div>

                          {/* mobile quick actions (stacked below image) */}
                          <div className="mt-2 sm:hidden flex items-center gap-2 px-3 pb-2">
                            <button onClick={(e) => { e.stopPropagation(); openFullscreen(it) }} aria-label="Open fullscreen" className="p-2.5 bg-black/60 rounded text-white touch-manipulation active:scale-95">⤢</button>
                            <a onClick={e => e.stopPropagation()} href={getDrivePreview(it.link)} target="_blank" rel="noreferrer" className="p-2.5 bg-black/60 rounded text-white touch-manipulation active:scale-95">↗</a>
                            <button onClick={(e) => { e.stopPropagation(); setPlaying(prev => ({ ...prev, [it.id]: true })) }} className="ml-auto px-4 py-2 rounded bg-primary/10 text-sm touch-manipulation active:scale-95">Play</button>
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

                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h3 className="font-semibold text-base sm:text-lg md:text-xl flex-1 break-words pr-2">{it.title}</h3>
                        <div className="text-xs sm:text-sm text-slate-500 whitespace-nowrap flex-shrink-0">{new Date(it.createdAt).toLocaleDateString()}</div>
                      </div>
                      <p className="text-sm sm:text-base text-slate-700 mb-4 line-clamp-2 min-h-[2.5rem]">{it.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {isAdmin && <button onClick={(e) => { e.stopPropagation(); doDelete(it.id) }} className="text-sm sm:text-base text-red-600 hover:text-red-800 font-medium touch-manipulation py-2 px-3 min-h-[44px] rounded border border-red-200 hover:bg-red-50">Delete</button>}
                        {isAdmin && <button onClick={(e) => { e.stopPropagation(); startEdit(it) }} className="text-sm sm:text-base text-primary hover:text-primary/80 touch-manipulation py-2 px-3 min-h-[44px] rounded border border-primary/20 hover:bg-primary/5">Edit</button>}
                        <a className="text-sm sm:text-base text-primary hover:text-primary/80 touch-manipulation py-2 px-3 min-h-[44px] rounded border border-primary/20 hover:bg-primary/5 inline-flex items-center justify-center" href={getDrivePreview(it.link)} target="_blank" rel="noreferrer">Open</a>
                      </div>
                    </div>
                  </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Show single category
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 px-1">{selectedCategory}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 md:gap-6">
                  {getFilteredAndSortedItems().map(it => (
                    <div key={it.id} className="rounded-lg overflow-hidden shadow-lg bg-white border group hover-lift card-glow transition-transform transform hover:scale-[1.02]">
                      <div className="relative">
                        {!playing[it.id] && (
                          <div className="relative">
                            <img src={it.thumbnail || '/placeholder.jpg'} alt={it.title} className="w-full h-40 sm:h-48 object-cover" />

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
                        <div className="flex flex-wrap items-center gap-3">
                          {isAdmin && <button onClick={(e) => { e.stopPropagation(); doDelete(it.id) }} className="text-sm sm:text-base text-red-600 hover:text-red-800 font-medium touch-manipulation py-2 px-3 min-h-[44px] rounded border border-red-200 hover:bg-red-50">Delete</button>}
                          {isAdmin && <button onClick={(e) => { e.stopPropagation(); startEdit(it) }} className="text-sm sm:text-base text-primary hover:text-primary/80 touch-manipulation py-2 px-3 min-h-[44px] rounded border border-primary/20 hover:bg-primary/5">Edit</button>}
                          <a className="text-sm sm:text-base text-primary hover:text-primary/80 touch-manipulation py-2 px-3 min-h-[44px] rounded border border-primary/20 hover:bg-primary/5 inline-flex items-center justify-center" href={getDrivePreview(it.link)} target="_blank" rel="noreferrer">Open</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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

