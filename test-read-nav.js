// test-read-nav.js
const fs = require('fs')
const path = require('path')

const filePath = path.join(process.cwd(), 'src', 'data', 'nav-list.json')
console.log('Trying path:', filePath)

try {
    const exists = fs.existsSync(filePath)
    console.log('exists:', exists)
    if (!exists) process.exit(1)

    const raw = fs.readFileSync(filePath, 'utf8')
    console.log('length:', raw.length)
    JSON.parse(raw) // will throw if invalid
    console.log('JSON parse OK')
} catch (e) {
    console.error('Error:', e.message)
    process.exit(1)
}
