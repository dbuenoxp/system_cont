const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const FILE_PATH = path.join(__dirname, '../data/consumos.json');
const PRODUCTOS_PATH = path.join(__dirname, '../data/products.json');

// Middleware para leer consumos
function leerConsumos() {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      } catch (err) {
        return {};
      }
}

router.get('/:turnoId', (req, res) => {
    const turnoId = req.params.turnoId;
    fs.readFile('./data/consumos.json', 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Error leyendo consumos' });
  
      const consumos = JSON.parse(data || '{}');
      res.json(consumos[turnoId] || []);
    });
  });

  const leerProductos = () => {
    try {
      const data = fs.readFileSync(PRODUCTOS_PATH, 'utf-8')
      return JSON.parse(data || '[]')
    } catch (err) {
      return []
    }
  }


// Guardar consumos por cliente
router.post('/:turnoId', (req, res) => {
    const turnoId = req.params.turnoId;
    const nuevosConsumos = req.body;
    const productos = leerProductos()


    nuevosConsumos.forEach(vendido => {
      const producto = productos.find(p => p.nombre === vendido.nombre)
      if (producto) {
        producto.stock -= vendido.cantidad
        if (producto.stock < 0) producto.stock = 0 // Evitar negativos
      }
    })
    guardarProductos(productos)
    fs.readFile('./data/consumos.json', 'utf8', (err, data) => {
      let consumos = {};
      if (!err && data) {
        consumos = JSON.parse(data);
      }
  
      consumos[turnoId] = nuevosConsumos;
  
      fs.writeFile('./data/consumos.json', JSON.stringify(consumos, null, 2), err => {
        if (err) {
          console.error('Error escribiendo consumos:', err);
          return res.status(500).json({ error: 'Error al guardar consumos' });
        }
  
        res.json({ mensaje: 'Consumos guardados correctamente' });
      });
    });
  });

  const guardarProductos = (productos) => {
    fs.writeFileSync(PRODUCTOS_PATH, JSON.stringify(productos, null, 2), 'utf-8')
  }

module.exports = router;
