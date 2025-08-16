const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

const BOLETA_FILE = path.join(__dirname, '../data/boleta_productos.json')
const PRODUCTOS_FILE = path.join(__dirname, '../data/products.json')

// Leer boletas
const leerBoletas = () => {
  try {
    const data = fs.readFileSync(BOLETA_FILE, 'utf-8')
    return JSON.parse(data || '{}')
  } catch (err) {
    return {}
  }
}

// Leer productos
const leerProductos = () => {
  try {
    const data = fs.readFileSync(PRODUCTOS_FILE, 'utf-8')
    return JSON.parse(data || '[]')
  } catch (err) {
    return []
  }
}

// Guardar productos actualizados
const guardarProductos = (productos) => {
  fs.writeFileSync(PRODUCTOS_FILE, JSON.stringify(productos, null, 2), 'utf-8')
}

// GET boletas de productos
router.get('/boleta_productos', (req, res) => {
  const ventasObj = leerBoletas()
  const ventasArray = Object.entries(ventasObj).map(([numero, venta]) => ({
    numero,
    ...venta
  }))
  res.json(ventasArray)
})

// POST registrar venta y disminuir stock
router.post('/boleta_productos', (req, res) => {
  const nuevaVenta = req.body
  const boletas = leerBoletas()
  const productos = leerProductos()

  // Actualizar stock
  nuevaVenta.productos.forEach(vendido => {
    const producto = productos.find(p => p.nombre === vendido.nombre)
    if (producto) {
      producto.stock -= vendido.cantidad
      if (producto.stock < 0) producto.stock = 0 // Evitar negativos
    }
  })

  guardarProductos(productos)

  // Generar ID de boleta
  const numero = `VP${Date.now()}_${Math.floor(Math.random() * 1000)}`
  boletas[numero] = nuevaVenta

  fs.writeFile(BOLETA_FILE, JSON.stringify(boletas, null, 2), err => {
    if (err) {
      console.error('Error al guardar venta:', err)
      return res.status(500).json({ error: 'No se pudo guardar la venta' })
    }
    res.json({ mensaje: 'Venta registrada', numero })
  })
})

module.exports = router
