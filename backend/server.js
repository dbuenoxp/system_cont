const express = require('express')
const cors = require('cors')
const playersRouter = require('./routes/players') 
const productsRouter = require('./routes/products');
const consumosRoutes = require('./routes/consumos');
const boletasRouter = require('./routes/boletas');
const boletaProductosRouter = require('./routes/boleta_productos')
const app = express() // ⬅️ Primero defines app

app.use(cors()) 
app.use(express.json()) 
app.use('/players', playersRouter);
app.use('/products', productsRouter);
app.use('/api/consumos', consumosRoutes);
app.use('/api', boletasRouter);
app.use(boletaProductosRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`)
})