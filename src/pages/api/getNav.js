// src/pages/api/getNav.js
import fs from 'fs'
import path from 'path'

const getFilePath = () =>
    path.join(process.cwd(), 'src', 'pages', 'data', 'nav-list.json')

const readDataFromFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
    }
    const fileData = fs.readFileSync(filePath, 'utf-8')
    try {
        return fileData ? JSON.parse(fileData) : []
    } catch (err) {
        throw new Error(`Invalid JSON in ${filePath}: ${err.message}`)
    }
}

export default function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const filePath = getFilePath()
        console.log('[api/getNav] reading file:', filePath)
        const properties = readDataFromFile(filePath)
        return res.status(200).json(properties)
    } catch (error) {
        console.error('[api/getNav] Error reading nav list:', error)
        return res
            .status(500)
            .json({ error: 'Failed to fetch nav list', message: error.message })
    }
}
