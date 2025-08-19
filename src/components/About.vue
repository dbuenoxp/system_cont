<template>
    <div class="admin-view futuristic-card">
      <div class="admin-card">
        <div class="clock-container futuristic-clock">
          <h2><span class="clock-glow">{{ currentTime }}</span></h2>
        </div>
      <h1 class="title">Administrar Turnos</h1>
      <div class="top-bar">
        <div class="filter-container">
          <label for="fechaFiltro">📅 Filtrar por fecha:</label>
          <input type="date" id="fechaFiltro" v-model="fechaFiltro" />
        </div>

        <div class="actions">
          <button class="btn" @click="exportar">📤 Exportar</button>
          <button class="btn" @click="showModal = true">➕ Nuevo</button>
        </div>
      </div>
  <div class="table-responsive"><table class="turnos-table futuristic-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombres</th>
            <th>Edad</th>
            <th>Monto</th>
            <th>Tiempo</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Estado</th>
            <th>Productos</th>
            <th>Controles</th>
            <th>Cobrar</th>
          </tr>
        </thead>
      <tbody>
        <tr v-for="(p, i) in paginatedPlayers" :key="p.id">
          <td>{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
          <td>{{ p.nombre }} {{ p.apellido }}</td>
          <td>{{ p.edad }}</td>
          <td>S/{{ p.monto }}</td>
          <td>{{ p.tiempo }} min</td>
          <td>{{ formatDate(p.entrada) }}</td>
          <td>{{ formatDate(p.salida) }}</td>
          <td>
            <span :class="['estado', (p.estado || '').toLowerCase().replace(/\s/g, '')]">
            {{ p.estado || 'Sin estado' }}
          </span>
          </td>
          <td>
            <button class="buttonList" @click="abrirModalProductos(p)" :title="obtenerResumenProductos(p, i)">🛒</button>
          </td>
          <td>  
            <span @click="editar(i)" style="cursor:pointer">✏️</span> 
            <span @click="eliminarJugador(p.id)" style="cursor:pointer">🗑️</span>
          </td>
          <td>
            <button  @click="abrirModalCobrar(p, i)" 
              :disabled="p.estadoPago === 'PAGADO'"
              :class="{ 'disabled-button': p.estadoPago === 'PAGADO' }">💵</button>
          </td>
        </tr>
      </tbody>
  </table></div>
    <div class="pagination">
      <button @click="cambiarPagina(currentPage - 1)" :disabled="currentPage === 1">⬅️ Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="cambiarPagina(currentPage + 1)" :disabled="currentPage === totalPages">Siguiente ➡️</button>
    </div>


</div>
    <!-- Modal -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal modal-nuevo-registro">
        <h2 class="modal-title">{{ modoEditar ? 'Editar Registro' : 'Nuevo Registro' }}</h2>
        <form @submit.prevent="modoEditar ? actualizar() : registrar()" class="form-grid form-grid-responsive">
          <div class="form-row">
            <div class="form-group" style="position:relative;">
              <label>👤 Nombres:</label>
              <input v-model="form.nombre" placeholder="Ingrese nombre" required
                    @input="buscarSugerenciasNombre"
                    @focus="buscarSugerenciasNombre"
                    @blur="ocultarSugerenciasConRetardo"
                    autocomplete="off" />
              <ul v-if="sugerenciasNombre.length && mostrarSugerenciasNombre" class="autocomplete-list">
                <li v-for="(s, idx) in sugerenciasNombre" :key="idx" @mousedown.prevent="seleccionarSugerencia(s)">
                  {{ s.nombre }} {{ s.apellido }}
                </li>
              </ul>
            </div>
            <div class="form-group" style="position:relative;">
              <label>👤 Apellidos:</label>
              <input v-model="form.apellido" placeholder="Ingrese apellido" required
                    @input="buscarSugerenciasApellido"
                    @focus="buscarSugerenciasApellido"
                    @blur="ocultarSugerenciasConRetardoApellido"
                    autocomplete="off" />
              <ul v-if="sugerenciasApellido.length && mostrarSugerenciasApellido" class="autocomplete-list">
                <li v-for="(s, idx) in sugerenciasApellido" :key="idx" @mousedown.prevent="seleccionarSugerencia(s)">
                  {{ s.nombre }} {{ s.apellido }}
                </li>
              </ul>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>🎂 Edad:</label>
              <input v-model.number="form.edad" type="number" placeholder="Edad" required />
            </div>
            <div class="form-group">
              <label>💰 Monto (S/):</label>
              <input v-model.number="form.monto" type="number" placeholder="Monto (12 o 20)" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group" style="flex:1;">
              <label>💳 Forma de Pago:</label>
              <select v-model="form.pago">
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>YAPE</option>
                <option>PLIN</option>
              </select>
            </div>
          </div>
          <div class="form-actions form-actions-responsive">
            <button type="submit">💾 Guardar</button>
            <button type="button" @click="showModal = false">❌ Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="modal-backdrop">
    <div class="modal">
      <h3>⚠️ Confirmar Eliminación</h3>
      <p>¿Se encuentra seguro de eliminar este registro?</p>
      <div style="display: flex; gap: 1rem;">
        <button @click="eliminar">✅ Sí</button>
        <button @click="showDeleteConfirm = false">❌ No</button>
      </div>
    </div>
  </div>
  
  <div v-show="showProductosModal" class="modal-backdrop">
    <div class="modal modal-productos-consumidos">
      <h2 class="modal-title">📦 Productos Consumidos</h2>
      <form class="form-grid form-grid-responsive" @submit.prevent="agregarProducto">
        <div class="form-row">
          <div class="form-group" style="flex:1;">
            <label>Producto:</label>
            <select v-model="productoSeleccionadoId" class="form-input" @change="asignarPrecio" required>
              <option disabled value="">Seleccione producto</option>
              <option v-for="prod in productosDisponibles" :key="prod.id" :value="prod.id">
                {{ prod.nombre }} - S/ {{ prod.precio }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" class="form-input w-32" v-model.number="nuevoProducto.cantidad" min="1" placeholder="Cantidad" required />
          </div>
          <div class="form-group">
            <label>Precio S/:</label>
            <input type="number" class="form-input w-32" v-model.number="nuevoProducto.precio" placeholder="Precio" readonly />
          </div>
        </div>
        <div class="form-actions form-actions-responsive">
          <button type="submit" class="btn-secondary">➕ Agregar</button>
          <button type="button" class="btn-danger" @click="cerrarModalProductos">❌ Cerrar</button>
        </div>
      </form>
      <div class="table-responsive">
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
            <tr v-for="(prod, i) in productosConsumidos" :key="i">
              <td>{{ prod.nombre }}</td>
              <td>{{ prod.cantidad }}</td>
              <td>S/{{ prod.precio }}</td>
              <td>S/{{ (prod.cantidad * prod.precio).toFixed(2) }}</td>
              <td><button @click="eliminarProducto(i)">🗑️</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="modal-backdrop" v-if="showCobrarModal">
    <div class="modal modal-cobrar">
      <h2 class="title">PLAYGROUND</h2>
      <label>Av. Principal 123 - Lima, Perú</label>
      <label>R.U.C. 12345678900</label>
      <p class="boleta-title">BOLETA DE VENTA ELECTRÓNICA</p>
      <label>B001 - N°000001</label>
  <div class="table-responsive">
    <table class="boleta-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in productosCobroActual" :key="i">
            <td>{{ p.nombre }}</td>
            <td>{{ p.cantidad }}</td>
            <td>S/. {{ p.precio }}</td>
            <td>S/. {{ (p.precio * p.cantidad).toFixed(2) }}</td>
          </tr>
          <tr>
            <td colspan="3">Tiempo de juego</td>
            <td>S/. {{ (montoJuegoActual).toFixed(2) }}</td>
          </tr>
          <tr>
            <td colspan="3"><strong>Total a pagar</strong></td>
            <td><strong>S/. {{ (total).toFixed(2) }}</strong></td>
          </tr>
        </tbody>
  </table></div>

      <div class="form-group">
        <label for="pago">Tipo de pago:</label>
        <select v-model="tipoPago">
          <option>Efectivo</option>
          <option>Yape</option>
          <option>Plin</option>
          <option>Tarjeta</option>
        </select>
      </div>

      <div class="form-group">
        <label for="monto">Monto recibido:</label>
        <input type="number" v-model.number="montoRecibido" />
      </div>

      <div class="form-group" v-if="montoRecibido > total">
        <label>Vuelto:</label>
        <span><strong>S/. {{ (montoRecibido - total).toFixed(2) }}</strong></span>
      </div>

      <div class="form-actions">
        <button class="btn-danger" @click="generarPDF">Generar PDF</button>
        <button class="btn-success" @click="marcarComoPagado">Marcar como pagado</button>
        <button class="btn-danger" @click="cerrarModalCobrar">Cerrar</button>
      </div>
    </div>
  </div>
        <div v-if="mensaje" class="notificacion">
        {{ mensaje }}
        </div>
    </div>
  </template>

  <script setup>
  import * as XLSX from 'xlsx'
  import { saveAs } from 'file-saver'
  import { ref, onMounted, watch, computed } from 'vue'
  import jsPDF from 'jspdf'
  import autoTable from 'jspdf-autotable'

const showModal = ref(false)
const players = ref([])
const mensaje = ref('')
const form = ref({ nombre: '', apellido: '', edad: '', monto: '', pago: 'Efectivo' })
const currentTime = ref(new Date().toLocaleString())
const modoEditar = ref(false)
const editIndex = ref(null)
const ClienteIndex = ref(null)
const showDeleteConfirm = ref(false)
const deleteIndex = ref(null)
const showProductosModal = ref(false)
const clienteActual = ref(null)
const productoSeleccionado = ref(null)
const cantidadProducto = ref(1)
const productosDelCliente = ref([])
const showCobrarModal = ref(false)
const clienteCobroActual = ref(null)
const productosCobroActual = ref([])
const montoJuegoActual = ref(0)
const productosDisponibles = ref([])
const productoSeleccionadoId = ref('')
const cantidadSeleccionada = ref(1)
const productosConsumidosTemp = ref([])
const turnoSeleccionado = ref(null)
const tipoPago = ref('Efectivo')
const montoRecibido = ref(0)
const productos = ref([])
const productosConsumidos = ref([])
const nuevoProducto = ref({ nombre: '', cantidad: 1, precio: 0 })
const fechaFiltro = ref(new Date().toISOString().split('T')[0])
const currentPage = ref(1)
const itemsPerPage = 8
const sugerenciasNombre = ref([]);
const sugerenciasApellido = ref([]);
const mostrarSugerenciasNombre = ref(false);
const mostrarSugerenciasApellido = ref(false);
let retardoSugerencia = null;
  //const props = defineProps({ clienteId: String })

// Bloquear scroll del body cuando hay un modal abierto
watch([
  showModal,
  showDeleteConfirm,
  showProductosModal,
  showCobrarModal
], ([modal, del, prod, cobrar]) => {
  const anyOpen = modal || del || prod || cobrar
  document.body.style.overflow = anyOpen ? 'hidden' : ''
})

  const props = defineProps({
    clienteId: String,
    clienteNombre: String,
    montoJuego: Number,
    show: Boolean,
  })
  const emit = defineEmits(['close', 'pagado'])
  // const tipoPago = ref('Efectivo')
  // const montoRecibido = ref(0)
  // const productos = ref([])
  // const productosConsumidos = ref([])
  // const nuevoProducto = ref({ nombre: '', cantidad: 1, precio: 0 })

  // const cargarProductos = () => {
  //   const data = localStorage.getItem('productos')
  //   if (data) productos.value = JSON.parse(data)
  // }

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:3000/products')
      const data = await response.json()
      console.log('Productos cargados:', data) // Verifica aquí
      productos.value = data || [] // Asegura que siempre sea array
    } catch (error) {
      console.error('Error cargando productos:', error)
      productos.value = []
    }
  }

  const cerrarModalCobrar = () => {
    showCobrarModal.value = false;
  };

const asignarPrecio = () => {
  const producto = productosDisponibles.value.find(p => p.id === productoSeleccionadoId.value);
  if (producto) {
    nuevoProducto.value.precio = producto.precio;
    nuevoProducto.value.nombre = producto.nombre; // por si lo necesitas luego
  }
}

const estaPagado = (id) => {
  const estados = JSON.parse(localStorage.getItem('estadoPago') || '{}')
  return estados[id] === 'Pagado'
}

const guardarConsumos = async () => {
  try {
    const turnoId = generarTurnoId(turnoSeleccionado.value);
    const res = await fetch(`http://localhost:3000/api/consumos/${turnoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productosConsumidos.value)
    });
    const data = await res.json();
    console.log('✅ Consumos guardados:',data.mensaje);
  } catch (error) {
    console.error('Error al guardar consumos:', error);
  }
};

const total = computed(() => {
  const totalProductos = productosCobroActual.value.reduce(
    (sum, p) => sum + p.precio * p.cantidad,
    0
  )
  return totalProductos + montoJuegoActual.value
})

const abrirModalCobrar = async  (cliente, index) => {
  clienteCobroActual.value = cliente
  montoJuegoActual.value = cliente.monto || 0

  const turnoId = generarTurnoId(cliente)

  try {
    const res = await fetch(`http://localhost:3000/api/consumos/${turnoId}`)
    if (!res.ok) throw new Error('No se pudo obtener los productos')
    productosCobroActual.value = await res.json()
  } catch (err) {
    console.error('❌ Error cargando consumos:', err)
    productosCobroActual.value = []
  }

  showCobrarModal.value = true
}

const generarPDF = () => {
  const doc = new jsPDF()
  doc.setFontSize(12)
  doc.text('PLAYGROUND', 85, 10)
  doc.text('Av. Principal 123 - Lima, Perú', 55, 16)
  doc.text('R.U.C. 12345678900', 70, 22)
  doc.text('BOLETA DE VENTA ELECTRÓNICA', 50, 28)
  doc.text('B001 - N°000001', 80, 34)

  const rows = productosCobroActual.value.map(p => [
    `${p.nombre} (${p.cantidad} x S/. ${p.precio})`,
    `S/. ${(p.cantidad * p.precio).toFixed(2)}`
  ])

  rows.push(['Tiempo de juego', `S/. ${montoJuegoActual.value.toFixed(2)}`])
  rows.push(['', ''])
  rows.push(['Total a pagar', `S/. ${total.value.toFixed(2)}`])
  rows.push(['Tipo de pago', tipoPago.value])
  rows.push(['Monto recibido', `S/. ${montoRecibido.value}`])
  rows.push(['Vuelto', `S/. ${(montoRecibido.value - total.value).toFixed(2)}`])

  autoTable(doc, {
    startY: 40,
    head: [['Descripción', 'Total']],
    body: rows,
  })

  doc.save(`boleta_${clienteCobroActual.value.nombre}.pdf`)
}

const marcarComoPagado = async () =>  {
  const boleta = {
    cliente: clienteCobroActual.value,
    productos: productosCobroActual.value,
    montoJuego: montoJuegoActual.value,
    total: total.value,
    tipoPago: tipoPago.value,
    montoRecibido: montoRecibido.value,
    vuelto: (montoRecibido.value - total.value),
    fechaHora: new Date().toISOString()
  }

  try {
    const res = await fetch('http://localhost:3000/api/boleta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(boleta)
    })

    const data = await res.json()
    console.log('✅ Boleta guardada con ID:', data.boletaId)
    const resPago = await fetch(`http://localhost:3000/players/${clienteCobroActual.value.id}/pagar`, {
      method: 'POST'
    });
    const dataPago = await resPago.json();
    console.log('✅ Estado actualizado:', dataPago);

    emit('pagado', clienteCobroActual.value.id);
    emit('close');
  } catch (error) {
    console.error('Error al guardar boleta:', error)
  }
}

const agregarProducto = async () => {
  const producto = productos.value.find(p => p.nombre === nuevoProducto.value.nombre);
  if (!producto || nuevoProducto.value.cantidad <= 0) return;

  const consumido = productosConsumidos.value.find(p => p.nombre === producto.nombre);
  const cantidadTotal = (consumido?.cantidad || 0) + nuevoProducto.value.cantidad;

  if (cantidadTotal > producto.stock) {
    alert('⚠️ Stock insuficiente');
    return;
  }

  if (consumido) {
    consumido.cantidad += nuevoProducto.value.cantidad;
  } else {
    productosConsumidos.value.push({ ...nuevoProducto.value });
  }

  // Solo limpiar el formulario de producto, no el cliente ni la lista de productos
  nuevoProducto.value = { nombre: '', cantidad: 1, precio: 0 };
  productoSeleccionadoId.value = '';
  await guardarConsumos();
  // No tocar showProductosModal ni clienteActual aquí
};

const cargarConsumos = async (turnoId) => {
  try {
    const res = await fetch(`http://localhost:3000/api/consumos/${turnoId}`);
    productosConsumidos.value = await res.json();
  } catch (err) {
    console.error('Error al cargar consumos:', err);
    productosConsumidos.value = [];
  }
};

const eliminarProducto = (index) => {
  productosConsumidos.value.splice(index, 1)
  guardarProductosConsumidos()
}

const guardarProductosConsumidos = () => {
  if (!clienteActual.value) return
  const key = `productosConsumidos_${ClienteIndex.value}_${clienteActual.value.nombre}_${clienteActual.value.apellido}`
  localStorage.setItem(key, JSON.stringify(productosConsumidos.value))
  mostrarMensaje('🛒 Productos guardados')
}

const filteredAndSortedPlayers = computed(() => {
  const fecha = fechaFiltro.value // formato YYYY-MM-DD

return players.value
  .filter(p => {
    const entradaDate = new Date(p.entrada)
    const entradaStr = entradaDate.toISOString().split('T')[0]
    return entradaStr === fecha
  })
  .sort((a, b) => new Date(b.entrada) - new Date(a.entrada))
})

const paginatedPlayers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedPlayers.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredAndSortedPlayers.value.length / itemsPerPage))
const cambiarPagina = (pagina) => {
  if (pagina >= 1 && pagina <= totalPages.value) {
    currentPage.value = pagina
  }
}

const obtenerResumenProductos = (cliente, index) => {
  const key = `productosConsumidos_${index}_${cliente.nombre}_${cliente.apellido}`
  const data = localStorage.getItem(key)
  if (!data) return 'Sin productos'
  const productos = JSON.parse(data)
  if (productos.length === 0) return 'Sin productos'
  return productos.map(p => `${p.nombre} (${p.cantidad})`).join(', ')
}

const cargarProductosConsumidos = (cliente, index) => {
  ClienteIndex.value = index
  console.log("Cliente: ", cliente + '_' + index)
  const key = `productosConsumidos_${index}_${cliente.nombre}_${cliente.apellido}`
  const data = localStorage.getItem(key)
  productosConsumidos.value = data ? JSON.parse(data) : []
}

  const exportar = () => {
    const data = players.value.map((p, i) => ({
      Orden: i + 1,
      Nombre: p.nombre,
      Apellido: p.apellido,
      Edad: p.edad,
      Monto: `S/${p.monto}`,
      Tiempo: `${p.tiempo} min`,
      'Tipo de Pago': p.pago,
      'Fecha y Hora Entrada': formatDate(p.entrada),
      'Fecha y Hora Salida': formatDate(p.salida),
      Estado: p.estado
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Turnos')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'turnos.xlsx')
  }

  // const abrirModalProductos = (cliente, index) => {
  //   clienteActual.value = cliente
  //   cargarProductosConsumidos(cliente, index)
  //   showProductosModal.value = true
  // }

  const abrirModalProductos = async (cliente) => {
    if (!cliente || !cliente.entrada || !cliente.nombre) {
      console.error('❌ Cliente no válido:', cliente);
      return;
    }

    if (showProductosModal.value && clienteActual.value && clienteActual.value.id === cliente.id) {
      return;
    }

    turnoSeleccionado.value = cliente;
    const turnoId = generarTurnoId(cliente);
    clienteActual.value = cliente;
    productosConsumidosTemp.value = [];
    showProductosModal.value = true;

    if (productosDisponibles.value.length === 0) {
      try {
        const res = await fetch('http://localhost:3000/products');
        productosDisponibles.value = await res.json();
      } catch (err) {
        console.error('Error cargando productos:', err);
      }
    }

    await cargarConsumos(turnoId);
  };

  const cerrarModalProductos = () => {
    showProductosModal.value = false;
    clienteActual.value = null;
    productosConsumidos.value = [];
    nuevoProducto.value = { nombre: '', cantidad: 1, precio: 0 };
  };

  const generarTurnoId = (cliente) => {
    const nombre = cliente.nombre || 'anonimo';
    const apellido = cliente.apellido || '';
    const entrada = new Date(cliente.entrada).toISOString().split('T')[0];
    const hora = new Date(cliente.entrada).toTimeString().split(' ')[0].replace(/:/g, '');
    return `turno_${nombre}_${apellido}_${entrada}_${hora}`;
  }
  
//   const guardarProductosConsumidos = () => {
//   const key = `productosConsumidos_${clienteActual.value.nombre}_${clienteActual.value.apellido}`
//   localStorage.setItem(key, JSON.stringify(productosDelCliente.value))
//   cerrarModalProductos()
//   mostrarMensaje('🛒 Productos guardados')
// }

const registrar = async () => {
  const entrada = new Date();
  const tiempo = calcularTiempo(form.value.monto);
  const salida = new Date(entrada.getTime() + tiempo * 60000);

  const nuevoJugador = {
    ...form.value,
    tiempo,
    entrada,
    salida,
    estado: 'En Juego'
  };

  try {
    const res = await fetch('http://localhost:3000/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoJugador)
    });
    const data = await res.json();
    players.value.push(data);
    showModal.value = false;
    mostrarMensaje('✅ Registro guardado');
  } catch (error) {
    console.error('Error al registrar:', error);
    mostrarMensaje('❌ Error al registrar');
  }
};

  const obtenerJugadores = async () => {
    try {
      const response = await fetch('http://localhost:3000/players')
      if (!response.ok) throw new Error('Error al obtener jugadores')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en obtenerJugadores:', error)
      return []
    }
  };

    const abrirNuevo = () => {
        form.value = { nombre: '', apellido: '', edad: '', monto: '', pago: 'Efectivo' }
        modoEditar.value = false
        showModal.value = true
    }

    const calcularTiempo = (monto) => {
        if (monto === 12) return 15
        if (monto === 20) return 30
        if (monto === 40) return 60
        // Proporcional
        const minutosPorSol = 15 / 12
        return Math.round(monto * minutosPorSol)
    }

    const cancelar = () => {
        showModal.value = false
        modoEditar.value = false
        editIndex.value = null
    }

    const editar = (index) => {
        editIndex.value = index
        form.value = { ...players.value[index] }
        modoEditar.value = true
        showModal.value = true
    }

    const confirmarEliminar = (index) => {
      deleteIndex.value = index
      showDeleteConfirm.value = true
    }

    const eliminar = () => {
      if (deleteIndex.value !== null) {
        players.value.splice(deleteIndex.value, 1)
        eliminarJugador(deleteIndex.value)
      }
      showDeleteConfirm.value = false
      deleteIndex.value = null
    }

    const eliminarJugador = async (id) => {
      if (!confirm('¿Seguro que deseas eliminar este jugador?')) return
      try {
        await fetch(`http://localhost:3000/players/${id}`, {
          method: 'DELETE'
        })
        players.value = players.value.filter(p => p.id !== id)
        mostrarMensaje('🗑️ Jugador eliminado')
      } catch (error) {
        console.error('Error al eliminar jugador:', error)
        mostrarMensaje('❌ Error al eliminar')
      }
    }

    const actualizar = () => {
        const original = players.value[editIndex.value]
        const nuevoMonto = form.value.monto
        const nuevoTiempo = calcularTiempo(nuevoMonto)

        const nuevaSalida = new Date(new Date(original.entrada).getTime() + nuevoTiempo * 60000)

        const jugadorActualizado  = {
            ...form.value,
            tiempo: nuevoTiempo,
            entrada: original.entrada,
            salida: nuevaSalida,
            estado: 'En Juego'
        }

        modificarJugador(jugadorActualizado)
        showModal.value = false
        modoEditar.value = false
        editIndex.value = null
        mostrarMensaje('✏️ Registro modificado')
    }

    const modificarJugador = async (jugadorActualizado) => {
      try {
        const res = await fetch(`http://localhost:3000/players/${jugadorActualizado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jugadorActualizado)
        })
        const data = await res.json()
        const index = players.value.findIndex(p => p.id === data.id)
        if (index !== -1) {
          players.value[index] = data
        }
        showModal.value = false
        mostrarMensaje('✅ Jugador actualizado')
      } catch (error) {
        console.error('Error al editar jugador:', error)
        mostrarMensaje('❌ Error al editar')
      }
    }

    const formatDate = (d) => new Date(d).toLocaleString()

    const actualizarEstados = () => {
      const ahora = new Date()
      players.value.forEach((p) => {
        const tiempoRestante = new Date(p.salida).getTime() - ahora.getTime()
        const minutos = tiempoRestante / 60000
        if (minutos <= 0) {
          p.estado = 'Tiempo Vencido'
        } else if (minutos <= 5) {
          p.estado = 'Por Vencer'
        } else {
          p.estado = 'En Juego'
        }
      })
    }

    const guardarEnLocal = () => {
        localStorage.setItem('players', JSON.stringify(players.value))
    }

    const mostrarMensaje = (text) => {
        mensaje.value = text
        setTimeout(() => mensaje.value = '', 3000)
    }

    function getUniquePlayersByNameApellido(arr) {
      const seen = new Set();
      return arr.filter(p => {
        const key = `${p.nombre}|${p.apellido}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    function buscarSugerenciasNombre() {
      const texto = form.value.nombre.trim().toLowerCase();
      if (texto.length < 2) {
        sugerenciasNombre.value = [];
        mostrarSugerenciasNombre.value = false;
        return;
      }
      const matches = players.value.filter(p =>
        p.nombre.toLowerCase().includes(texto) || p.apellido.toLowerCase().includes(texto)
      );
      sugerenciasNombre.value = getUniquePlayersByNameApellido(matches).slice(0, 6);
      mostrarSugerenciasNombre.value = !!sugerenciasNombre.value.length;
    }

    function buscarSugerenciasApellido() {
      const texto = form.value.apellido.trim().toLowerCase();
      if (texto.length < 2) {
        sugerenciasApellido.value = [];
        mostrarSugerenciasApellido.value = false;
        return;
      }
      const matches = players.value.filter(p =>
        p.apellido.toLowerCase().includes(texto) || p.nombre.toLowerCase().includes(texto)
      );
      sugerenciasApellido.value = getUniquePlayersByNameApellido(matches).slice(0, 6);
      mostrarSugerenciasApellido.value = !!sugerenciasApellido.value.length;
    }


    function seleccionarSugerencia(s) {
      form.value.nombre = s.nombre;
      form.value.apellido = s.apellido;
      form.value.edad = s.edad;
      sugerenciasNombre.value = [];
      sugerenciasApellido.value = [];
      mostrarSugerenciasNombre.value = false;
      mostrarSugerenciasApellido.value = false;
    }

    function ocultarSugerenciasConRetardo() {
      retardoSugerencia = setTimeout(() => {
        mostrarSugerenciasNombre.value = false;
      }, 120);
    }

    function ocultarSugerenciasConRetardoApellido() {
      retardoSugerencia = setTimeout(() => {
        mostrarSugerenciasApellido.value = false;
      }, 120);
    }

    onMounted(async () => {
      //currentTime.value = new Date().toLocaleString()
      const data = await obtenerJugadores()
      players.value.splice(0, players.value.length, ...(data || []));
      cargarProductos()
      //actualizarEstados()
      setInterval(() => {
        currentTime.value = new Date().toLocaleString()
        actualizarEstados()
      }, 100)
    })

  </script>


  <style scoped>
  /* .admin-view {
    padding: 2rem;
  } */

  .title, .boleta-title {
  text-align: center;
  font-weight: bold;
}
.boleta-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.boleta-table td, .boleta-table th {
  padding: 4px;
  border-bottom: 1px solid #ddd;
  font-size: 13px;
}

.total-row {
  font-weight: bold;
}
.form-group {
  margin-top: 10px;
}
.actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
.actions button {
  padding: 5px 10px;
  font-size: 14px;
}

  .title {
    color: #2c3e50;
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  .actions {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .disabled-button {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .w-32 {
      width: 8rem !important;
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

.producto-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
select, input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 120px;
}
.productos-table {
  width: 100%;
  border-collapse: collapse;
}
.productos-table th,
.productos-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
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

  .table-responsive {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1rem;
  }
  .turnos-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  th, td {
    border: 1.5px solid #f7c59f;
    padding: 0.5rem;
    text-align: center;
  }
  th {
    background: linear-gradient(90deg, #b3e6ff 0%, #a3c8f7 100%);
    color: #4a6fa5;
    white-space: nowrap;
    border: 2px solid #a3c8f7;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 4px #fff6e6;
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
  .icon-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    margin: 0 0.25rem;
  }

  .clock-container {
    background: linear-gradient(135deg, #b3e6ff 0%, #a3c8f7 100%);
    color: #4a6fa5;
    font-size: 1.5rem;
    /* padding: 2.5rem 4rem; */
    border-radius: 30px;
    box-shadow: 0 0 32px 8px #a3c8f755, 0 0 0 4px #b3e6ff44;
    text-align: center;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
    border: 2px solid #a3c8f7;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .clock-glow {
    text-shadow: 0 0 8px #fff6e6, 0 0 16px #f7c59f, 0 0 4px #ffe6b3;
    font-weight: bold;
    letter-spacing: 0.1em;
  }
  .futuristic-clock::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(120deg, #ffe6b333 0%, #f7c59f22 100%);
    z-index: -1;
    border-radius: 30px;
    pointer-events: none;
  }

  .estado {
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  color: white;
  display: inline-block;
  font-weight: bold;
}
.enjuego {
  background-color: green;
}
.porvencer {
  background-color: orange;
  animation: blink 1s infinite;
}
.tiempovencido {
  background-color: red;
}
@keyframes blink {
  50% { opacity: 0; }
}

/* Modal general */

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

.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 18px;
  width: 95vw;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  position: relative;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
}

.modal-productos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


/* Formulario mejorado y responsivo */
.modal-nuevo-registro {
  max-width: 500px;
  width: 98vw;
  padding: 2rem 1.2rem;
}
.modal-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  color: #226488;
  letter-spacing: 0.04em;
}
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-row {
  display: flex;
  gap: 1.2rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.form-group label {
  font-weight: bold;
  margin-bottom: 0.3rem;
  font-size: 15px;
  color: #226488;
}
.modal input,
.modal select {
  padding: 0.7rem;
  border: 1.5px solid #a3c8f7;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  background: #f8fafc;
}
.modal input:focus,
.modal select:focus {
  border-color: #226488;
}
.form-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.8rem;
}
.form-actions button {
  flex: 1 1 120px;
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
@media (max-width: 600px) {
  .modal-nuevo-registro {
    max-width: 99vw;
    padding: 1rem 0.2rem;
  }
  .form-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

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
  .futuristic-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(120deg, #ffe6b311 0%, #f7c59f11 100%);
    z-index: 0;
    border-radius: 18px;
    pointer-events: none;
  }
  .admin-card > * { position: relative; z-index: 1; }
  .futuristic-bg {
    background: linear-gradient(120deg, #ffe6b3 0%, #fff6e6 100%);
    min-height: 100vh;
    padding: 2rem 0;
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

  .pagination{
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }
  .pagination button {
    background-color: #b3e6ff;
    color: #226488;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    height: 40px;
    box-shadow: 0 2px 8px #b3e6ff33;
    transition: background 0.2s, color 0.2s;
    min-width: 150px;
  }
  .pagination button:disabled {
    background-color: #e6f7ff;
    color: #a3c8f7;
    cursor: not-allowed;
    opacity: 0.7;
  }
  .pagination button:not(:disabled):hover {
    background-color: #a3c8f7;
    color: #17405c;
  }

.filter-container{
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

#fechaFiltro{
  margin-left: 10px;
}
.pagination .page-item.active .page-link {
  background-color: #00bac7;
  border-color: #00bac7;
  color: white;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.autocomplete-list {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 10010;
  background: #fff;
  border: 1.5px solid #a3c8f7;
  border-radius: 8px;
  box-shadow: 0 2px 8px #b3e6ff33;
  width: 100%;
  max-height: 180px;
  overflow-y: auto;
  margin-top: 2px;
  padding: 0;
  list-style: none;
}
.autocomplete-list li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
}
.autocomplete-list li:hover {
  background: #e6f7ff;
}

/* Modal productos consumidos mejorado */
.modal-productos-consumidos {
  max-width: 800px;
  width: 98vw;
  padding: 2rem 1.2rem;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
@media (max-width: 900px) {
  .modal-productos-consumidos {
    max-width: 99vw;
    padding: 1rem 0.2rem;
    max-height: 98vh;
  }
  .modal-productos-consumidos .table-responsive {
    max-width: 100vw;
    overflow-x: auto;
  }
}
.modal-productos-consumidos .form-row {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1rem;
}
.modal-productos-consumidos .form-group label {
  font-weight: bold;
  margin-bottom: 0.3rem;
  font-size: 15px;
  color: #226488;
}
.modal-productos-consumidos .form-input,
.modal-productos-consumidos select {
  padding: 0.7rem;
  border: 1.5px solid #a3c8f7;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  background: #f8fafc;
}
.modal-productos-consumidos .form-input:focus,
.modal-productos-consumidos select:focus {
  border-color: #226488;
}
.modal-productos-consumidos .form-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.5rem;
}
.modal-productos-consumidos .form-actions button {
  flex: 1 1 120px;
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
.modal-productos-consumidos .btn-secondary {
  background-color: #805dca;
  color: #fff;
}
.modal-productos-consumidos .btn-secondary:hover {
  background-color: #6846b1;
}
.modal-productos-consumidos .btn-danger {
  background-color: #dc3545;
  color: white;
}
.modal-productos-consumidos .btn-danger:hover {
  background-color: #c82333;
}

.modal-cobrar {
  max-width: 800px;
  width: 98vw;
  padding: 2rem 1.2rem;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

@media (max-width: 900px) {
  .modal-cobrar .table-responsive {
    max-width: 100vw;
    overflow-x: auto;
    min-width: 320px;
  }
  .modal-cobrar table {
    min-width: 600px;
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .modal-productos-consumidos {
    max-width: 99vw;
    padding: 1rem 0.2rem;
  }
  .modal-productos-consumidos .form-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  .modal-productos-consumidos .form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .modal {
    padding: 1rem;
    width: 98vw;
    max-width: 420px;
  }
  .form-actions {
    flex-direction: column;
  }
  table {
    font-size: 12px;
    min-width: 600px;
  }
}

@media (max-width: 600px) {
  .modal-productos-consumidos .form-actions button {
    flex: 1 1 44px;
  }
  .modal-productos-consumidos .form-actions {
    gap: 0.5rem;
  }

  .modal-nuevo-registro .form-actions button {
    flex: 1 1 44px;
  }
  .modal-nuevo-registro .form-actions {
    gap: 0.5rem;
  }
}
  </style>
