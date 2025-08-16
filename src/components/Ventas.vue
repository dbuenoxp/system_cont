<template>
    <div class="admin-card">
      <h1 class="title">Ventas de Productos</h1>
  
      <div class="flex justify-end mb-4">
        <button class="btn btn-success ml-14 mb-4" @click="abrirNuevaVenta">➕ Nueva Venta</button>
      </div>
  
      <!-- Tabla de ventas -->
      <table class="w-full table-auto border mt-4">
        <thead>
          <tr class="bg-gray-200 text-left text-sm">
            <th class="p-2">N° Venta</th>
            <th class="p-2">Cliente</th>
            <th class="p-2">Total</th>
            <th class="p-2">Fecha</th>
            <th class="p-2 text-center">Detalle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in ventas" :key="v.numero" class="text-sm border-t">
            <td class="p-2">{{ v.numero }}</td>
            <td class="p-2">{{ v.cliente }}</td>
            <td class="p-2">S/. {{ v.total.toFixed(2) }}</td>
            <td class="p-2">{{ new Date(v.fecha).toLocaleString() }}</td>
            <td class="p-2 text-center">
              <button @click="verDetalle(v)" class="buttonList">🔍</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal Nueva Venta -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal">
          <h2>🧾 Nueva Venta</h2>
          <div class="form-group">
            <label>Cliente:</label>
            <input v-model="cliente" type="text" class="form-input" placeholder="Nombre del cliente" />
          </div>
  
          <div class="form-group producto-form">
            <label>Producto:</label>
            <select v-model="productoSeleccionadoId" class="form-input" @change="asignarPrecio">
              <option disabled value="">Seleccione producto</option>
              <option v-for="prod in productosDisponibles" :key="prod.id" :value="prod.id">
                {{ prod.nombre }} - S/ {{ prod.precio }} (Stock: {{ prod.stock }})
               </option>
            </select>
  
            <div class="form-group">
              <label>Cantidad:</label>
              <input type="number" class="form-input w-32" v-model.number="nuevoProducto.cantidad" placeholder="Cantidad" />
            </div>
  
            <div class="form-group">
              <label style="margin-left: 4px;">Precio S/:</label>
              <input type="number" class="form-input w-32" v-model.number="nuevoProducto.precio" readonly />
            </div>
  
            <button class="mt-24 btn-secondary" @click="agregarProducto">➕ Agregar</button>
          </div>
  
          <table class="productos-table">
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
                <td>S/{{ prod.precio }}</td>
                <td>S/{{ (prod.precio * prod.cantidad).toFixed(2) }}</td>
                <td><button @click="eliminarProducto(i)">🗑️</button></td>
              </tr>
            </tbody>
          </table>
  
          <div class="form-actions mt-4 flex justify-end gap-2">
            <button class="btn-primary" @click="guardarVenta">💾 Guardar Venta</button>
            <button @click="cerrarModal" class="btn-danger">❌ Cerrar</button>
          </div>
        </div>
      </div>
  
      <!-- Modal Detalle Venta -->
      <div v-if="showDetalle" class="modal-backdrop">
        <div class="modal">
          <h2 class="title">Detalle de Venta</h2>
          <p><strong>Cliente:</strong> {{ detalleSeleccionado.cliente }}</p>
          <p><strong>Fecha:</strong> {{ new Date(detalleSeleccionado.fecha).toLocaleString() }}</p>
          <p><strong>Total:</strong> S/. {{ detalleSeleccionado.total.toFixed(2) }}</p>
  
          <table class="w-full table-auto border mt-2">
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
  
          <div class="form-actions mt-4">
            <button class="btn-danger" @click="showDetalle = false">❌ Cerrar</button>
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
  
  onMounted(async () => {
    const res1 = await fetch('http://localhost:3000/boleta_productos')
    const data = await res1.json()
    ventas.value = data
  
    const res2 = await fetch('http://localhost:3000/products')
    productosDisponibles.value = await res2.json()
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
  
    const res = await fetch('http://localhost:3000/boleta_productos', {
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
  </style>
  