<template>
    <div class="admin-card">
      <h1 class="title">Gestión de Consumos</h1>
  
      <!-- Filtros y botones -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Nombre:</label>
            <input v-model="filtroNombre" type="text" placeholder="Buscar boleta..." class="form-input" />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Fecha:</label>
            <input v-model="filtroFecha" type="date" class="form-input" />
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary ml-14" @click="exportarExcel">📤 Exportar</button>
        </div>
      </div>
  
      <!-- Lista de boletas -->
      <table class="w-full table-auto border mt-24">
        <thead>
          <tr class="bg-gray-200 text-left text-sm">
            <th class="p-2">N° Boleta</th>
            <th class="p-2">Cliente</th>
            <th class="p-2">Tipo de Pago</th>
            <th class="p-2">Monto</th>
            <th class="p-2">Fecha</th>
            <th class="p-2 text-center">Ver Detalle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in boletasPaginadas" :key="b.numero" class="text-sm border-t">
            <td class="p-2">{{ b.numero }}</td>
            <td class="p-2">{{ b.cliente.nombre }} {{ b.cliente.apellido }}</td>
            <td class="p-2">{{ b.tipoPago }}</td>
            <td class="p-2">S/. {{ b.total.toFixed(2) }}</td>
            <td class="p-2">{{ new Date(b.fechaHora).toLocaleString() }}</td>
            <td class="p-2 text-center">
              <button @click="abrirModalDetalle(b)" class="buttonList">🔍</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Paginación -->
      <div class="flex justify-center mt-4">
        <button class="btn" @click="paginaActual--" :disabled="paginaActual === 1">⏪</button>
        <span class="px-4">Página {{ paginaActual }} de {{ totalPaginas }}</span>
        <button class="btn" @click="paginaActual++" :disabled="paginaActual === totalPaginas">⏩</button>
      </div>
  
      <!-- Modal Detalle -->
      <div v-if="showDetalle" class="modal-backdrop">
        <div class="modal">
          <h2 class="title">Detalle de Boleta</h2>
  
          <div class="mb-3">
            <p><strong>Cliente:</strong> {{ detalleSeleccionado.cliente.nombre }} {{ detalleSeleccionado.cliente.apellido }}</p>
            <p><strong>Tipo de pago:</strong> {{ detalleSeleccionado.tipoPago }}</p>
            <p><strong>Fecha:</strong> {{ new Date(detalleSeleccionado.fechaHora).toLocaleString() }}</p>
            <p><strong>Tiempo de juego:</strong> S/. {{ detalleSeleccionado.montoJuego.toFixed(2) }}</p>
            <p><strong>Monto recibido:</strong> S/. {{ detalleSeleccionado.montoRecibido.toFixed(2) }}</p>
            <p><strong>Vuelto:</strong> S/. {{ detalleSeleccionado.vuelto.toFixed(2) }}</p>
          </div>
  
          <div v-if="detalleSeleccionado.productos.length">
            <h3>Productos Consumidos</h3>
            <table class="w-full table-auto border">
              <thead>
                <tr>
                  <th class="p-2">Producto</th>
                  <th class="p-2">Cantidad</th>
                  <th class="p-2">Precio</th>
                  <th class="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(prod, i) in detalleSeleccionado.productos" :key="i">
                  <td class="p-2">{{ prod.nombre }}</td>
                  <td class="p-2">{{ prod.cantidad }}</td>
                  <td class="p-2">S/. {{ prod.precio.toFixed(2) }}</td>
                  <td class="p-2">S/. {{ (prod.precio * prod.cantidad).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div class="form-actions mt-24">
            <button class="btn-danger" @click="showDetalle = false">❌ Cerrar</button>
          </div>
        </div>
      </div>
  
      <div v-if="mensaje" class="notificacion">{{ mensaje }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import * as XLSX from 'xlsx'
  
  const filtroNombre = ref('')
  const filtroFecha = ref('')
  const showDetalle = ref(false)
  const detalleSeleccionado = ref({ cliente: {}, productos: [] })
  const mensaje = ref('')
  const boletas = ref([])
  const paginaActual = ref(1)
  const boletasPorPagina = 10
  
  onMounted(async () => {
    const res = await fetch('http://localhost:3000/api/boletas')
    const data = await res.json()
    const parsed = Object.entries(data).map(([key, val]) => ({ numero: key, ...val }))
    boletas.value = parsed
  })
  
  const boletasFiltradas = computed(() => {
    return boletas.value.filter(b => {
      const nombreCoincide = `${b.cliente.nombre} ${b.cliente.apellido}`.toLowerCase().includes(filtroNombre.value.toLowerCase())
      const fechaCoincide = !filtroFecha.value || new Date(b.fechaHora).toISOString().split('T')[0] === filtroFecha.value
      return nombreCoincide && fechaCoincide
    })
  })
  
  const totalPaginas = computed(() => Math.ceil(boletasFiltradas.value.length / boletasPorPagina))
  const boletasPaginadas = computed(() => {
    const start = (paginaActual.value - 1) * boletasPorPagina
    return boletasFiltradas.value.slice(start, start + boletasPorPagina)
  })
  
  const abrirModalDetalle = (boleta) => {
    detalleSeleccionado.value = boleta
    showDetalle.value = true
  }
  
  const exportarExcel = () => {
    const data = boletasFiltradas.value.map(b => {
      const productos = b.productos.map(p => `${p.nombre} (x${p.cantidad})`).join(', ')
      return {
        'N° Boleta': b.numero,
        Cliente: `${b.cliente.nombre} ${b.cliente.apellido}`,
        'Tipo de Pago': b.tipoPago,
        'Monto Juego': b.montoJuego,
        'Productos': productos,
        'Total': b.total,
        'Monto Recibido': b.montoRecibido,
        'Vuelto': b.vuelto,
        'Fecha': new Date(b.fechaHora).toLocaleString(),
      }
    })
  
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Boletas')
    XLSX.writeFile(wb, 'boletas.xlsx')
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
    width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }
  </style>
  