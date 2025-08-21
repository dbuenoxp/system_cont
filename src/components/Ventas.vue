<template>
    <div class="admin-view futuristic-card">
    <div class="admin-card">
      <h1 class="title">Ventas de Productos</h1>
      <div class="acciones-header">
        <button class="btn btn-primary" @click="abrirNuevaVenta">➕ Nueva Venta</button>
      </div>
      <div class="table-responsive">
        <table class="ventas-table futuristic-table">
          <thead>
            <tr>
              <th>N° Venta</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Fecha</th>
              <th class="text-center">Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in ventas" :key="v.numero">
              <td>{{ v.numero }}</td>
              <td>{{ v.cliente }}</td>
              <td>S/. {{ v.total.toFixed(2) }}</td>
              <td>{{ new Date(v.fecha).toLocaleString() }}</td>
              <td class="text-center">
                <button @click="verDetalle(v)" class="btn btn-icon">🔍</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
   
    </div>
       <!-- Modal Nueva Venta -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal-nuevo-registro">
          <h2 class="modal-title">🧾 Nueva Venta</h2>
          <div class="form-group" style="position:relative;">
            <label for="cliente">Cliente:</label>
            <input id="cliente" v-model="cliente" type="text" class="form-input" placeholder="Nombre del cliente" @input="filtrarClientes" @focus="mostrarSugerencias = true" @blur="ocultarSugerencias" autocomplete="off" />
            <ul v-if="mostrarSugerencias && sugerenciasClientes.length" class="autocomplete-list">
              <li v-for="(s, i) in sugerenciasClientes" :key="i" @mousedown.prevent="seleccionarCliente(s)">
                {{ s.nombre }} {{ s.apellido }}
              </li>
            </ul>
          </div>
  
          <div class="form-group">
            <label for="producto">Producto:</label>
            <select id="producto" v-model="productoSeleccionadoId" class="form-input" @change="asignarPrecio">
              <option disabled value="">Seleccione producto</option>
              <option v-for="prod in productosDisponibles" :key="prod.id" :value="prod.id">
                {{ prod.nombre }} - S/ {{ prod.precio }} (Stock: {{ prod.stock }})
              </option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="cantidad">Cantidad:</label>
              <input id="cantidad" type="number" class="form-input" v-model.number="nuevoProducto.cantidad" min="1" placeholder="Cantidad" />
            </div>
            <div class="form-group">
              <label for="precio">Precio S/:</label>
              <input id="precio" type="number" class="form-input" v-model.number="nuevoProducto.precio" readonly />
            </div>
            <div class="form-group form-group-btn">
              <button class="btn btn-secondary agregar-btn" @click="agregarProducto">➕ Agregar</button>
            </div>
          </div>
          <div class="table-responsive">
            <table class="productos-table productos-table-detalle futuristic-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prod, i) in productosVenta" :key="i">
                  <td>{{ prod.nombre }}</td>
                  <td>{{ prod.cantidad }}</td>
                  <td>S/. {{ prod.precio }}</td>
                  <td>S/. {{ (prod.precio * prod.cantidad).toFixed(2) }}</td>
                  <td><button class="btn btn-icon" @click="eliminarProducto(i)">🗑️</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" @click="guardarVenta">💾 Guardar Venta</button>
            <button class="btn btn-danger" @click="cerrarModal">❌ Cerrar</button>
          </div>
        </div>
      </div>
  
      <!-- Modal Detalle Venta -->
      <div v-if="showDetalle" class="modal-backdrop">
        <div class="modal modal-nuevo-registro">
          <h2 class="modal-title">Detalle de Venta</h2>
          <div class="detalle-boleta-card">
            <div class="detalle-boleta-row">
              <div class="detalle-boleta-label">👤 Cliente</div>
              <div class="detalle-boleta-value">{{ detalleSeleccionado.cliente }}</div>
            </div>
            <div class="detalle-boleta-row">
              <div class="detalle-boleta-label">📅 Fecha</div>
              <div class="detalle-boleta-value">{{ new Date(detalleSeleccionado.fecha).toLocaleString() }}</div>
            </div>
            <div class="detalle-boleta-row total-row">
              <div class="detalle-boleta-label">💰 Total</div>
              <div class="detalle-boleta-value">S/. {{ detalleSeleccionado.total.toFixed(2) }}</div>
            </div>
          </div>
          <div v-if="detalleSeleccionado.productos && detalleSeleccionado.productos.length" class="productos-card-responsive">
            <h3 class="productos-title">Productos Vendidos</h3>
            <div class="table-responsive">
              <table class="productos-table futuristic-table productos-table-detalle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(prod, i) in detalleSeleccionado.productos" :key="i">
                    <td>{{ prod.nombre }}</td>
                    <td>{{ prod.cantidad }}</td>
                    <td>S/. {{ prod.precio.toFixed(2) }}</td>
                    <td>S/. {{ (prod.precio * prod.cantidad).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="form-actions form-actions-responsive">
            <button type="button" @click="showDetalle = false">❌ Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const showModal = ref(false)
  const showDetalle = ref(false)
  const ventas = ref([])
  const cliente = ref('')
  const productoSeleccionadoId = ref('')
  const nuevoProducto = ref({ cantidad: 1, precio: 0 })
  const productosVenta = ref([])
  const detalleSeleccionado = ref({})
  const productosDisponibles = ref([])

  const sugerenciasClientes = ref([])
  const mostrarSugerencias = ref(false)
  const listaClientes = ref([])
  
  onMounted(async () => {
    const res1 = await fetch(`${API_BASE_URL}boleta_productos`)
    let data = await res1.json()
    data = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    ventas.value = data

    const res2 = await fetch(`${API_BASE_URL}products`)
    productosDisponibles.value = await res2.json()

    const resClientes = await fetch(`${API_BASE_URL}players`)
    listaClientes.value = await resClientes.json()
  })

  const abrirNuevaVenta = () => {
    cliente.value = ''
    productoSeleccionadoId.value = ''
    productosVenta.value = []
    showModal.value = true
  }
  
  const asignarPrecio = () => {
    const producto = productosDisponibles.value.find(p => p.id === productoSeleccionadoId.value)
    nuevoProducto.value.precio = producto ? producto.precio : 0
  }

  const getStockDisponible = (productoId) => {
    const prod = productosDisponibles.value.find(p => p.id === productoId)
    return prod ? prod.stock : 0
    }
  
    const agregarProducto = () => {
        const producto = productosDisponibles.value.find(p => p.id === productoSeleccionadoId.value)
        if (!producto) return

        const cantidadDisponible = producto.stock
        const cantidadSolicitada = nuevoProducto.value.cantidad

        if (cantidadSolicitada > cantidadDisponible) {
            alert(`❌ No hay suficiente stock de ${producto.nombre}. Stock disponible: ${cantidadDisponible}`)
            return
        }

        productosVenta.value.push({
            id: producto.id,
            nombre: producto.nombre,
            cantidad: cantidadSolicitada,
            precio: producto.precio
        })

        productoSeleccionadoId.value = ''
        nuevoProducto.value = { cantidad: 1, precio: 0 }
        }
  
  const eliminarProducto = (index) => {
    productosVenta.value.splice(index, 1)
  }
  
  const guardarVenta = async () => {
    const total = productosVenta.value.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
    const venta = {
      cliente: cliente.value,
      productos: productosVenta.value,
      total,
      fecha: new Date().toISOString()
    }

    const res = await fetch(`${API_BASE_URL}boleta_productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venta)
    })
  
    const data = await res.json()
    ventas.value.push({ numero: data.numero, ...venta })
    showModal.value = false
  }
  
  const cerrarModal = () => {
    showModal.value = false
  }
  
  const verDetalle = (venta) => {
    detalleSeleccionado.value = venta
    showDetalle.value = true
  }

  function filtrarClientes() {
    if (!cliente.value) {
      sugerenciasClientes.value = []
      return
    }
    const texto = cliente.value.toLowerCase()
    // Agrupar por nombre completo único
    const unicos = new Map()
    for (const c of listaClientes.value) {
      const key = `${c.nombre} ${c.apellido}`.toLowerCase()
      if (key.includes(texto) && !unicos.has(key)) {
        unicos.set(key, c)
      }
    }
    sugerenciasClientes.value = Array.from(unicos.values()).slice(0, 6)
  }

  function seleccionarCliente(c) {
    cliente.value = `${c.nombre} ${c.apellido}`
    mostrarSugerencias.value = false
    sugerenciasClientes.value = []
  }
  function ocultarSugerencias() {
    setTimeout(() => { mostrarSugerencias.value = false }, 120)
  }
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .mb-4{
    margin-bottom: 4px;
  }
  /* --- ADMIN CARD --- */
  .admin-card {
    background: linear-gradient(120deg, #fff6e6 0%, #ffe6b3 100%);
    border-radius: 18px;
    box-shadow: 0 8px 32px 0 #f7c59f44, 0 1.5px 8px #ffe6b322;
    padding: 2.5rem 2rem 2rem 2rem;
    margin: 1.5rem auto;
    max-width: 1200px;
    border: 2px solid #f7c59f;
    position: relative;
    overflow: hidden;
  }

  .acciones-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.2rem;
  }
  .title {
   color: #226488;
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
 .btn {
  padding: 0 1.5rem;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background-color: #b3e6ff;
  color: #226488;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px #b3e6ff33;
  transition: background 0.2s, color 0.2s;
  min-width: 150px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
}

.btn:last-child { margin-right: 0; }
.btn:hover {
  background-color: #a3c8f7;
  color: #17405c;
}

  .btn-primary {
    background: linear-gradient(90deg, #b3e6ff 0%, #a3c8f7 100%);
    color: #226488;
  }
  .btn-primary:hover {
    background: #a3c8f7;
    color: #17405c;
  }
  .btn-danger {
    background: #dc3545;
    color: white;
  }
  .btn-danger:hover {
    background: #c82333;
  }
    .btn-secondary {
    --tw-border-opacity: 1;
    border-color: rgb(128 93 202 / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: rgb(128 93 202 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
    --tw-shadow-color: rgb(128 93 202 / .6);
    --tw-shadow: var(--tw-shadow-colored);
}
  .btn-icon {
    padding: 0.3rem 0.7rem;
    font-size: 1.1rem;
    border-radius: 8px;
    background: #e6f7ff;
    color: #226488;
  }
  .btn-icon:hover {
    background: #b3e6ff;
  }
  .agregar-btn {
    margin-top: 0.7rem;
    align-self: flex-end;
  }
  .table-responsive {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1rem;
  }

  .futuristic-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(120deg, #ffe6b311 0%, #f7c59f11 100%);
    z-index: 0;
    border-radius: 18px;
    pointer-events: none;
  }

  .form-row {
    display: flex;
    gap: 0.7rem;
    width: 100%;
    align-items: flex-end;
    margin-top: 0.2rem;
  }
  .form-group-btn {
    margin-bottom: 0;
    align-self: flex-end;
  }
  @media (max-width: 700px) {
    .form-row {
      flex-direction: column;
      gap: 0.2rem;
    }
    .table-responsive {
      margin-bottom: 0.5rem;
    }
  }

  .ventas-table, .productos-table {
    min-width: 520px;
    width: 100%;
    border-collapse: collapse;
    background: #f8fafc;
    box-sizing: border-box;
  }
  .ventas-table th, .ventas-table td, .productos-table th, .productos-table td {
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
    border-bottom: 1px solid #e6e6e6;
    text-align: center;
  }
  .ventas-table th, .productos-table th {
    background: linear-gradient(90deg, #b3e6ff 0%, #a3c8f7 100%);
    color: #226488;
  }
  .ventas-table td, .productos-table td {
    color: #2c3e50;
  }

   .futuristic-table td {
    border: 1.5px solid #f7c59f;
    background: #e6f7ff;
    color: #4a6fa5;
    font-size: 1rem;
    transition: background 0.2s;
  }
  .futuristic-table tr:hover td {
    background: #b3e6ff;
  }
  .futuristic-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 16px #f7c59f33;
  }
  .productos-table-detalle th, .productos-table-detalle td {
    font-size: 0.98rem;
    padding: 0.35rem 0.7rem;
    word-break: break-word;
  }
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  .modal-nuevo-registro {
    background: #fff;
    padding: 2rem;
    border-radius: 18px;
    width: 95vw;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    position: relative;
    z-index: 100000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0 auto;
    align-items: center;
    justify-content: flex-start;
  }
  .modal-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.2rem;
    color: #226488;
    letter-spacing: 0.04em;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.7rem;
    width: 100%;
  }
  .form-input {
    padding: 0.5rem 0.7rem;
    border: 1px solid #b3e6ff;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    background: #f8fafc;
    color: #226488;
    transition: border 0.2s;
  }
  .form-input:focus {
    border: 1.5px solid #226488;
  }
  .form-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.8rem;
    width: 100%;
  }
  /* Detalle Venta Card */
  .detalle-boleta-card {
    background: linear-gradient(120deg, #f8fafc 60%, #e6f7ff 100%);
    border-radius: 14px;
    box-shadow: 0 2px 12px #b3e6ff22;
    padding: 1.2rem 1.5rem 1.2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 1.5px solid #a3c8f7;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .detalle-boleta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.35rem 0;
    border-bottom: 1px solid #e6e6e6;
    font-size: 1.05rem;
  }
  .detalle-boleta-row:last-child {
    border-bottom: none;
  }
  .detalle-boleta-label {
    color: #226488;
    font-weight: 600;
    letter-spacing: 0.01em;
    min-width: 120px;
  }
  .detalle-boleta-value {
    color: #2c3e50;
    font-weight: 500;
    text-align: right;
  }
  .total-row .detalle-boleta-label, .total-row .detalle-boleta-value {
    color: #28a745;
    font-weight: bold;
  }
  .productos-card-responsive {
    width: 100%;
    max-width: 500px;
    margin: 0 auto 1.2rem auto;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.08);
    padding: 1.2rem 1rem 1.2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .productos-title {
    margin: 1.2rem 0 0.5rem 0;
    font-size: 1.1rem;
    color: #226488;
    font-weight: bold;
    word-break: break-word;
    text-align: left;
  }

  .autocomplete-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #b3e6ff;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 2px 8px #b3e6ff33;
    z-index: 10010;
    max-height: 180px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .autocomplete-list li {
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1rem;
    color: #226488;
    transition: background 0.18s;
  }
  .autocomplete-list li:hover {
    background: #e6f7ff;
  }

  .form-actions button {
  flex: 1 1 44px;
  padding: 0.7rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 120px;
  max-width: 180px;
  font-weight: 600;
}
.form-actions button[type="submit"] {
  background-color: #28a745;
  color: white;
}
.form-actions button[type="submit"]:hover {
  background-color: #218838;
}
.form-actions button[type="button"] {
  background-color: #dc3545;
  color: white;
}
.form-actions button[type="button"]:hover {
  background-color: #c82333;
}

  .admin-card > * { position: relative; z-index: 1; }

  @media (max-width: 900px) {
    .ventas-card {
      padding: 1.2rem 0.5rem 1rem 0.5rem;
      margin: 1.2rem auto 0 auto;
    }
    .modal-nuevo-registro {
      max-width: 99vw;
      padding: 1rem 0.2rem;
    }
    .form-actions {
      flex-direction: column;
      gap: 0.5rem;
    }
    .ventas-table, .productos-table {
      font-size: 12px;
      min-width: 600px;
    }
    .productos-card-responsive {
      max-width: 100vw;
      padding: 1rem 0.2rem;
      border-radius: 12px;
    }
  }
  </style>
  