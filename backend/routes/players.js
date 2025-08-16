const express = require('express')
const fs = require('fs')
const router = express.Router()
const path = './data/players.json'
const path2 = require('path');
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/fsUtils')
const PLAYERS_FILE_PATH = path2.join(__dirname, '../data/players.json');

// Leer
router.get('/', (req, res) => {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer archivo' })
    res.json(JSON.parse(data))
  })
})

router.post('/', async (req, res) => {
    try {
      console.log('Datos recibidos en POST:', req.body) // 👈 Esto es clave
      const players = await readJSON()
      const nuevoJugador = {
        id: uuidv4(),
        estadoPago: 'LIBRE',
        ...req.body,
      }
      players.push(nuevoJugador)
      await writeJSON(players)
      res.status(201).json(nuevoJugador)
    } catch (error) {
      console.error('Error en POST /players:', error)
      res.status(500).json({ error: 'Error al guardar jugador' })
    }
  })

// Modificar
router.put('/:id', async (req, res) => {
    try {
      const players = await readJSON()
      const index = players.findIndex(p => p.id === req.params.id)
      if (index === -1) {
        return res.status(404).json({ error: 'Jugador no encontrado' })
      }
      players[index] = { ...players[index], ...req.body }
      await writeJSON(players)
      res.json(players[index])
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar jugador' })
    }
})

// Eliminar
router.delete('/:id', async (req, res) => {
    try {
      let players = await readJSON()
      const index = players.findIndex(p => p.id === req.params.id)
      if (index === -1) {
        return res.status(404).json({ error: 'Jugador no encontrado' })
      }
      const eliminado = players[index]
      players.splice(index, 1)
      await writeJSON(players)
      res.json(eliminado)
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar jugador' })
    }
})

router.post('/:id/pagar', (req, res) => {
  const id = req.params.id
  const jugadores = leerPlayers()

  const index = jugadores.findIndex(p => p.id === id)
  if (index === -1) return res.status(404).json({ error: 'Jugador no encontrado' })

  jugadores[index].estadoPago = 'PAGADO'

  guardarPlayers(jugadores)
  res.json({ mensaje: 'Estado de pago actualizado a PAGADO' })
})

router.get('/ranking', async (req, res) => {
  try {
    const players = await readJSON()

    const acumulado = {}

    players.forEach(p => {
      const key = `${p.nombre.trim().toLowerCase()} ${p.apellido.trim().toLowerCase()}`
      if (!acumulado[key]) {
        acumulado[key] = {
          nombre: p.nombre,
          apellido: p.apellido,
          tiempoTotal: 0,
          cantidadVisitas: 0,
        }
      }

      acumulado[key].tiempoTotal += parseInt(p.tiempo || 0, 10)
      acumulado[key].cantidadVisitas += 1
    })

    const ranking = Object.values(acumulado).sort((a, b) => b.tiempoTotal - a.tiempoTotal)

    res.json(ranking)
  } catch (error) {
    console.error('Error en /players/ranking:', error)
    res.status(500).json({ error: 'Error al generar ranking' })
  }
})

function guardarPlayers(jugadores) {
  try {
    fs.writeFileSync(PLAYERS_FILE_PATH, JSON.stringify(jugadores, null, 2));
  } catch (err) {
    console.error('Error guardando players.json:', err);
  }
}

function leerPlayers() {
  try {
    const data = fs.readFileSync(PLAYERS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error leyendo players.json:', err);
    return [];
  }
}

module.exports = router
