const fs = require('fs')
const path = require('path')

const envFile = path.resolve(__dirname, '../../.env.local')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    }
  }
}

const conn = process.env.DATABASE_URL
if (!conn) {
  console.error('DATABASE_URL not set. Check .env.local')
  process.exit(1)
}

module.exports = { conn }
