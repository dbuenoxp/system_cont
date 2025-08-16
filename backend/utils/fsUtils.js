const fs = require('fs').promises
const path = require('path')

const FILE_PATH = path.join(__dirname, '../data/players.json')

async function readJSON() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(data || '[]')
  } catch (err) {
    console.error('Error al leer JSON:', err)
    return []
  }
}

async function writeJSON(data) {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error al escribir JSON:', err)
  }
}

module.exports = { readJSON, writeJSON }
