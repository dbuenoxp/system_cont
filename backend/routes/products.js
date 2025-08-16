const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const FILE_PATH = path.join(__dirname, '../data/products.json');

// Leer productos desde archivo
async function readProducts() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}

// Guardar productos en archivo
async function writeProducts(data) {
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
      const productos = await readProducts();
      res.json(productos);
    } catch (err) {
      console.error('Error al leer productos:', err);
      res.status(500).json({ error: 'Error al leer productos' });
    }
  });

// Registrar nuevo producto
router.post('/', async (req, res) => {
  try {
    const products = await readProducts();
    const nuevo = { id: uuidv4(), ...req.body };
    products.push(nuevo);
    await writeProducts(products);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar producto' });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'No encontrado' });

    products[index] = { ...products[index], ...req.body };
    await writeProducts(products);
    res.json(products[index]);
  } catch {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    let products = await readProducts();
    products = products.filter(p => p.id !== req.params.id);
    await writeProducts(products);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
