// Basic smoke tests for local API endpoints - run after dev server is up
const base = process.env.BASE_URL || 'http://localhost:3000'
const adminToken = process.env.ADMIN_TOKEN

async function get(url){
  const res = await fetch(base + url)
  console.log(url, res.status)
  return res
}

async function post(url, body){
  const res = await fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  console.log(url, res.status)
  return res
}

async function del(url, body){
  const headers = { 'Content-Type': 'application/json' }
  if (adminToken) headers['x-admin-token'] = adminToken
  const res = await fetch(base + url, { method: 'DELETE', headers, body: JSON.stringify(body) })
  console.log(url, res.status, await res.text())
  return res
}

async function run(){
  console.log('Base:', base)
  await get('/api/testimonials')
  // create testimonial
  const r = await post('/api/testimonials', { name: 'Smoke Tester', message: 'This is a smoke test message for automated checks.' })
  if (r.ok){
    const obj = await r.json().catch(() => null)
    if (obj && obj.id){
      console.log('Created test id', obj.id)
      await del('/api/testimonials', { id: obj.id })
    }
  }

  await get('/api/projects')
}

run().catch(err => { console.error(err); process.exit(1) })