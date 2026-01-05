import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'tmp')
const TESTIMONIALS_FILE = path.join(DATA_DIR, 'testimonials.json')
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json')

// In-memory fallback
let IN_MEMORY_TESTIMONIALS: any[] | null = null
let IN_MEMORY_PROJECTS: any[] | null = null
const USE_IN_MEMORY = process.env.USE_IN_MEMORY_STORAGE === '1' || process.env.USE_IN_MEMORY_STORAGE === 'true'

async function getKVClient() {
  // dynamic import so project doesn't hard-depend on @vercel/kv at runtime unless installed
  if (!process.env.VERCEL_KV_URL) return null
  try {
    // @ts-ignore - optional dependency
    const mod = await import('@vercel/kv').catch(() => null) as any
    // `kv` export is the client
    return (mod && mod.kv) || null
  } catch (err) {
    console.warn('Vercel KV client not available:', String(err))
    return null
  }
}

async function ensureFile(file: string) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(file)
  } catch (e) {
    try {
      await fs.writeFile(file, JSON.stringify([]), 'utf8')
    } catch (err: any) {
      // propagate so caller can decide to fall back
      throw err
    }
  }
}

export async function readTestimonialsStorage() {
  // Try KV first
  const kv = await getKVClient()
  if (kv) {
    try {
      const data = await kv.get('portfolio:testimonials')
      return Array.isArray(data) ? data : []
    } catch (err) {
      console.warn('KV read testimonials failed:', String(err))
    }
  }

  if (USE_IN_MEMORY && IN_MEMORY_TESTIMONIALS !== null) return IN_MEMORY_TESTIMONIALS

  try {
    await ensureFile(TESTIMONIALS_FILE)
    const txt = await fs.readFile(TESTIMONIALS_FILE, 'utf8')
    const data = JSON.parse(txt || '[]')
    return Array.isArray(data) ? data.map((d: any) => ({ ...d, replies: d.replies || [] })) : []
  } catch (err: any) {
    console.error('readTestimonialsStorage error:', err?.code || String(err))
    if (USE_IN_MEMORY) return IN_MEMORY_TESTIMONIALS || []
    throw err
  }
}

export async function writeTestimonialsStorage(items: any[]) {
  const kv = await getKVClient()
  if (kv) {
    try {
      await kv.set('portfolio:testimonials', items)
      return
    } catch (err) {
      console.warn('KV write testimonials failed:', String(err))
    }
  }

  if (USE_IN_MEMORY) {
    IN_MEMORY_TESTIMONIALS = items
    return
  }

  try {
    await ensureFile(TESTIMONIALS_FILE)
    await fs.writeFile(TESTIMONIALS_FILE, JSON.stringify(items, null, 2), 'utf8')
  } catch (err: any) {
    console.error('writeTestimonialsStorage error:', err?.code || String(err))
    if (err && (err.code === 'EROFS' || err.code === 'EACCES' || err.code === 'EPERM')) {
      if (USE_IN_MEMORY) {
        IN_MEMORY_TESTIMONIALS = items
        return
      }
      throw Object.assign(new Error('Server filesystem is read-only; data cannot be saved. Consider setting USE_IN_MEMORY_STORAGE=1 or migrating storage to an external DB (Supabase, Vercel KV).'), { code: err.code })
    }
    throw err
  }
}

export async function readProjectsStorage() {
  const kv = await getKVClient()
  if (kv) {
    try {
      const data = await kv.get('portfolio:projects')
      return Array.isArray(data) ? data : []
    } catch (err) {
      console.warn('KV read projects failed:', String(err))
    }
  }

  if (USE_IN_MEMORY && IN_MEMORY_PROJECTS !== null) return IN_MEMORY_PROJECTS

  try {
    await ensureFile(PROJECTS_FILE)
    const txt = await fs.readFile(PROJECTS_FILE, 'utf8')
    const data = JSON.parse(txt || '[]')
    return Array.isArray(data) ? data : []
  } catch (err: any) {
    console.error('readProjectsStorage error:', err?.code || String(err))
    if (USE_IN_MEMORY) return IN_MEMORY_PROJECTS || []
    throw err
  }
}

export async function writeProjectsStorage(items: any[]) {
  const kv = await getKVClient()
  if (kv) {
    try {
      await kv.set('portfolio:projects', items)
      return
    } catch (err) {
      console.warn('KV write projects failed:', String(err))
    }
  }

  if (USE_IN_MEMORY) {
    IN_MEMORY_PROJECTS = items
    return
  }

  try {
    await ensureFile(PROJECTS_FILE)
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(items, null, 2), 'utf8')
  } catch (err: any) {
    console.error('writeProjectsStorage error:', err?.code || String(err))
    if (err && (err.code === 'EROFS' || err.code === 'EACCES' || err.code === 'EPERM')) {
      if (USE_IN_MEMORY) {
        IN_MEMORY_PROJECTS = items
        return
      }
      throw Object.assign(new Error('Server filesystem is read-only; data cannot be saved. Consider setting USE_IN_MEMORY_STORAGE=1 or migrating storage to an external DB (Supabase, Vercel KV).'), { code: err.code })
    }
    throw err
  }
}
