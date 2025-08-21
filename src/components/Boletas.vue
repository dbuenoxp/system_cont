<template>
  <div class="admin-view futuristic-card">
    <div class="admin-card ">
      <h1 class="title">Gestión de Consumos</h1>
      <div class="top-bar">
        <div class="filter-container filter-row">
          <label class="filter-label">🔎 Nombre:</label>
          <input v-model="filtroNombre" type="text" placeholder="Buscar boleta..." class="form-input filter-input" />
          <label class="filter-label" style="margin-left:1.5rem;">📅 Fecha:</label>
          <input v-model="filtroFecha" type="date" class="form-input filter-input" />
        </div>
        <div class="actions">
          <button class="btn btn-primary" @click="exportarExcel">📤 Exportar</button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="boletas-table futuristic-table">
          <thead>
            <tr>
              <th>N° Boleta</th>
              <th>Cliente</th>
              <th>Tipo de Pago</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Ver Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in boletasPaginadas" :key="b.numero">
              <td>{{ b.numero }}</td>
              <td>{{ b.cliente.nombre }} {{ b.cliente.apellido }}</td>
              <td>{{ b.tipoPago }}</td>
              <td>S/. {{ b.total.toFixed(2) }}</td>
              <td>{{ new Date(b.fechaHora).toLocaleString() }}</td>
              <td>
                <button @click="abrirModalDetalle(b)" class="buttonList btn-action-edit">🔍</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <button class="btn" @click="paginaActual--" :disabled="paginaActual === 1">⏪</button>
        <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
        <button class="btn" @click="paginaActual++" :disabled="paginaActual === totalPaginas">⏩</button>
      </div>
      <div v-if="showDetalle" class="modal-backdrop">
        <div class="modal modal-nuevo-registro">
          <h2 class="modal-title">Detalle de Boleta</h2>
          <div class="detalle-boleta-card">
            <div class="detalle-boleta-row">
              <div class="detalle-boleta-label">👤 Cliente</div>
              <div class="detalle-boleta-value">{{ detalleSeleccionado.cliente.nombre }} {{ detalleSeleccionado.cliente.apellido }}</div>
            </div>
            <div class="detalle-boleta-row">
              <div class="detalle-boleta-label">💳 Tipo de pago</div>
              <div class="detalle-boleta-value">{{ detalleSeleccionado.tipoPago }}</div>
            </div>
            <div class="detalle-boleta-row">
              <div class="detalle-boleta-label">📅 Fecha</div>
              <div class="detalle-boleta-value">{{ new Date(detalleSeleccionado.fechaHora).toLocaleString() }}</div>
            </div>
            <div class="detalle-boleta-row">
              <div class="detalle-boleta-label">⏱️ Tiempo de juego</div>
              <div class="detalle-boleta-value">S/. {{ detalleSeleccionado.montoJuego.toFixed(2) }}</div>
            </div>
            <div class="detalle-boleta-row">
              <div class="detalle-boleta-label">💰 Monto recibido</div>
              <div class="detalle-boleta-value">S/. {{ detalleSeleccionado.montoRecibido.toFixed(2) }}</div>
            </div>
            <div class="detalle-boleta-row total-row">
              <div class="detalle-boleta-label">💸 Vuelto</div>
              <div class="detalle-boleta-value">S/. {{ detalleSeleccionado.vuelto.toFixed(2) }}</div>
            </div>
          </div>
          <div v-if="detalleSeleccionado.productos.length" class="productos-card-responsive">
            <h3 class="productos-title">Productos Consumidos</h3>
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
            <button type="button" class="btn-cerrar-modal" @click="showDetalle = false">❌ Cerrar</button>
          </div>
        </div>
      </div>
      <div v-if="mensaje" class="notificacion">{{ mensaje }}</div>
    </div>
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
    const res = await fetch(`${API_BASE_URL}api/boletas`)
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
.admin-view.futuristic-bg {
  background: linear-gradient(120deg, #ffe6b3 0%, #fff6e6 100%);
  min-height: 100vh;
  padding: 2rem 0;
}
.admin-card.futuristic-card {
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
.title {
  color: #226488;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.filter-label {
  font-size: 1.1rem;
  color: #226488;
  font-weight: 600;
  margin-right: 0.5rem;
  white-space: nowrap;
}
.filter-input {
  min-width: 180px;
  max-width: 220px;
  flex: 1 1 180px;
}
.actions {
  display: flex;
  gap: 0.5rem;
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
}
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

.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;
}
.boletas-table, .productos-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.boletas-table th, .productos-table th,
.boletas-table td, .productos-table td {
  border: 1.5px solid #f7c59f;
  padding: 0.5rem;
  text-align: center;
}
.boletas-table th, .productos-table th {
  background: linear-gradient(90deg, #b3e6ff 0%, #a3c8f7 100%);
  color: #226488;
  white-space: nowrap;
  border: 2px solid #a3c8f7;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 4px #fff6e6;
}
.futuristic-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 16px #f7c59f33;
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
.buttonList {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin: 0 0.25rem;
  color: #226488;
  transition: color 0.2s;
}
.btn-action-edit {
  color: #805dca !important;
}
.btn-action-edit:hover {
  color: #6846b1 !important;
}
.pagination {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

/* Tarjeta de datos principales del modal detalle boleta */
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

/* Productos Consumidos - estilos limpios y corregidos */
.productos-title {
  margin: 1.2rem 0 0.5rem 0;
  font-size: 1.1rem;
  color: #226488;
  font-weight: bold;
  word-break: break-word;
  text-align: left;
}
.productos-table-detalle {
  min-width: 420px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
.productos-table-detalle th, .productos-table-detalle td {
  font-size: 0.98rem;
  padding: 0.35rem 0.7rem;
  word-break: break-word;
}
.productos-table-detalle th {
  background: linear-gradient(90deg, #b3e6ff 0%, #a3c8f7 100%);
  color: #226488;
}
.productos-table-detalle td {
  background: #f8fafc;
  color: #2c3e50;
}
@media (max-width: 700px) {
  .detalle-boleta-grid {
    flex-direction: column;
    gap: 0.7rem;
  }
  .detalle-col {
    min-width: 0;
  }
  .productos-title {
    font-size: 1rem;
    text-align: left;
    margin-left: 0.2rem;
  }
  .productos-table-detalle {
    min-width: 320px;
    font-size: 12px;
  }
}
.productos-table-detalle th {
  background: linear-gradient(90deg, #b3e6ff 0%, #a3c8f7 100%);
  color: #226488;
}
.productos-table-detalle td {
  background: #f8fafc;
  color: #2c3e50;
}

/* Responsive card para Productos Consumidos */
.productos-card-responsive {
  width: 100%;
  max-width: 500px;
  margin: 0 auto 1.2rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
  /* padding: 1.2rem 1rem 1.2rem 1rem; */
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;
}
.productos-table-detalle {
  min-width: 420px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
@media (max-width: 700px) {
  .productos-card-responsive {
    max-width: 100vw;
    padding: 1rem 0.2rem;
    border-radius: 12px;
  }
  .productos-table-detalle {
    min-width: 320px;
    font-size: 12px;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
.form-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.8rem;
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
.form-actions button[type="button"] {
  background-color: #dc3545;
  color: white;
}
.form-actions button[type="button"]:hover {
  background-color: #c82333;
}
.notificacion {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: #333;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
@media (max-width: 900px) {
  .modal-nuevo-registro {
    max-width: 99vw;
    padding: 1rem 0.2rem;
  }
  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  .boletas-table, .productos-table {
    font-size: 12px;
    min-width: 600px;
  }
}

/* Botón cerrar modal tamaño y responsividad */
.btn-cerrar-modal {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  min-width: 90px;
  max-width: 130px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(220,53,69,0.08);
}
.btn-cerrar-modal:hover {
  background-color: #c82333;
}
@media (max-width: 700px) {
  .btn-cerrar-modal {
    font-size: 0.95rem;
    padding: 0.45rem 0.7rem;
    min-width: 80px;
    max-width: 100px;
  }
}
</style>
  