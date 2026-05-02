// Simple env checker for local/dev and CI
const required = ['ADMIN_TOKEN']
const optional = ['KV_REST_API_URL', 'KV_REST_API_TOKEN', 'USE_IN_MEMORY_STORAGE', 'SUPABASE_URL', 'SUPABASE_KEY']

function check() {
  const missing = required.filter(k => !process.env[k])
  if (missing.length) {
    console.error('Missing required env vars:', missing.join(', '))
    process.exitCode = 2
    return
  }
  console.log('Required env vars present.')

  const presentOptional = optional.filter(k => process.env[k])
  console.log('Optional env vars present:', presentOptional.join(', ') || '(none)')
}

if (require.main === module) check()

module.exports = { check }
