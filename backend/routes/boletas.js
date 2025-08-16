const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

const FILE_PATH = path.join(__dirname, '../data/boletas.json')

// Middleware para leer las boletas
const leerBoletas = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8')
    return JSON.parse(data || '{}')
  } catch (error) {
    return {}
  }
}

// POST /api/boleta
router.post('/boleta', (req, res) => {
  const nuevaBoleta = req.body

  const boletas = leerBoletas()

  // Genera un ID único por timestamp + número aleatorio
  const boletaId = `B${Date.now()}_${Math.floor(Math.random() * 1000)}`
  boletas[boletaId] = nuevaBoleta

  fs.writeFile(FILE_PATH, JSON.stringify(boletas, null, 2), err => {
    if (err) {
      console.error('Error guardando boleta:', err)
      return res.status(500).json({ error: 'Error al guardar boleta' })
    }

    res.json({ mensaje: 'Boleta guardada correctamente', boletaId })
  })
})

router.get('/boletas', (req, res) => {
  const boletasObj = leerBoletas()
  const boletas = Object.values(boletasObj) // Convertir a array
  res.json(boletas)
})

module.exports = router
