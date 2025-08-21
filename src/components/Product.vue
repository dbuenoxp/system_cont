<template>
  <div class="admin-view futuristic-card">
    <div class="admin-card">
      <h1 class="title">Gestión de Productos</h1>
      <div class="top-bar">
        <div class="filter-container filter-row">
          <label for="filtroNombre" class="filter-label">🔎 Buscar producto:</label>
          <input id="filtroNombre" v-model="filtroNombre" type="text" placeholder="Buscar producto..." class="form-input filter-input" />
        </div>
        <div class="actions">
          <button class="btn btn-primary" @click="showModal = true">➕ Nuevo</button>
          <button class="btn btn-primary" @click="exportarExcel">📤 Exportar</button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="productos-table futuristic-table product-table-bg">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in productosFiltrados" :key="p.id">
              <td>{{ p.nombre }}</td>
              <td>{{ p.categoria }}</td>
              <td>{{ p.stock }}</td>
              <td>S/ {{ p.precio }}</td>
              <td>
                <button class="buttonList btn-action-edit" @click="editarProducto(p.id)" title="Editar">✏️</button>
                <button class="buttonList btn-action-delete" @click="eliminar(p.id)" title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
       <!-- Modal -->
    <div v-if="showModal" class="modal-backdrop">
    <div class="modal-backdrop" v-if="showModal">
      <div class="modal modal-nuevo-registro">
        <h2 class="modal-title">{{ modoEdicion ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
        <form @submit.prevent="guardarProducto" class="form-grid form-grid-responsive">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre del producto</label>
              <input v-model="form.nombre" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Categoría</label>
              <select v-model="form.categoria" class="form-input" required>
                <option value="Bebida">Bebida</option>
                <option value="Snack">Snack</option>
                <option value="Dulce">Dulce</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Stock</label>
              <input v-model.number="form.stock" type="number" min="0" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Precio</label>
              <input v-model.number="form.precio" type="number" min="0" step="0.01" class="form-input" required />
            </div>
          </div>
          <div class="form-actions form-actions-responsive">
            <button type="button" @click="showModal = false">❌ Cancelar</button>
            <button type="submit">💾 Guardar</button>
          </div>
        </form>
      </div>
    </div>
      </div>
   
    </div>

    <div v-if="mensaje" class="notificacion">
        {{ mensaje }}
        </div>

    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import * as XLSX from 'xlsx';
  import { onMounted } from 'vue';
  
  const showModal = ref(false)
  const productos = ref([]);
  const filtroNombre = ref('');
  const mostrarModal = ref(false);
  const modoEdicion = ref(false);
  const mensaje = ref('')
  const showDeleteConfirm = ref(false)


  const props = defineProps({
    producto: Object,
    modoEdicion: Boolean
  });
  const emit = defineEmits(['guardar', 'cerrar']);

  const productosFiltrados = computed(() =>
    productos.value.filter(p =>
      p.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase())
    )
  );

  const form = ref({
    nombre: '',
    categoria: 'Bebida',
    stock: 0,
    precio: 0
  });
  
  watch(
    () => props.producto,
    (nuevo) => {
      if (nuevo) {
        form.value = { ...nuevo };
      } else {
        form.value = {
          nombre: '',
          categoria: 'Bebida',
          stock: 0,
          precio: 0
        };
      }
    },
    { immediate: true }
  );

  const resetFormulario = () => {
  form.value = {
    nombre: '',
    categoria: 'Bebida',
    stock: 0,
    precio: 0
  }
  modoEdicion.value = false
  showModal.value = false
}


  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}products`)
      const data = await response.json()
      console.log('Productos cargados:', data) // Verifica aquí
      productos.value = data || [] // Asegura que siempre sea array
    } catch (error) {
      console.error('Error cargando productos:', error)
      productos.value = []
    }
  }


  const guardarProducto = async () => {
    try {
      if (modoEdicion.value) {
        // Si es edición
        const res = await fetch(`${API_BASE_URL}products/${form.value.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        })
        const data = await res.json()
        const index = productos.value.findIndex(p => p.id === data.id)
        if (index !== -1) productos.value[index] = data
        //showModal.value = false
        mostrarMensaje('✏️ Producto modificado')
      } else {
        // Nuevo producto
        const res = await fetch(`${API_BASE_URL}products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        })
        const data = await res.json()
        productos.value.push(data)
        //showModal.value = false
        mostrarMensaje('✅ Producto agregado')
      }

      resetFormulario()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      mostrarMensaje('❌ Error al guardar producto')
    }
  }
  
  function editarProducto(id) {
    const producto = productos.value.find(p => p.id === id);
    if (producto) {
      form.value = { ...producto };
      modoEdicion.value = true;
      showModal.value = true;
    }
  }

  const mostrarMensaje = (text) => {
        mensaje.value = text
        setTimeout(() => mensaje.value = '', 3000)
  }

  const confirmarEliminar = (index) => {
      deleteIndex.value = index
      showDeleteConfirm.value = true
   }

    const eliminar = async (id) => {
      if (!confirm('¿Seguro que deseas eliminar este producto?')) return
      try {
        await fetch(`${API_BASE_URL}products/${id}`, {
          method: 'DELETE'
        })
        const index = productos.value.findIndex(p => p.id === id);
        if (index !== -1) productos.value.splice(index, 1);
        showDeleteConfirm.value = false
        mostrarMensaje('🗑️ Producto eliminado')
      } catch (error) {
        console.error('Error al eliminar producto:', error)
        mostrarMensaje('❌ Error al eliminar producto')
      }
    }
  
  function exportarExcel() {
    const data = productos.value.map(p => ({
      Nombre: p.nombre,
      Categoría: p.categoria,
      Stock: p.stock,
      Precio: p.precio
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    XLSX.writeFile(workbook, 'productos.xlsx');
  }

  // onMounted(async () => {
  //     const data = await cargarProductos()
  //     productos.value = data || []
  //     setInterval(() => {
  //       cargarProductos()
  //     }, 10000)
  //   })

    onMounted(async () => {
      cargarProductos();
    })

  // onMounted(() => {
  //   cargarProductos();
  // });
  </script>
  <style>
  .table-responsive {
    overflow: auto;
}

table {
    width: 100%;
    border-collapse: collapse !important;
}
table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
}

*, :before, :after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
}

.border-b-0 {
    border-bottom-width: 0px;
}
table thead tr, table tfoot tr {
    border-bottom-width: 0px;
    --tw-bg-opacity: 1 !important;
    background-color: rgb(246 248 250 / var(--tw-bg-opacity)) !important;
}

.ltr\:rounded-l-md:where([dir="ltr"],[dir="ltr"] *) {
    border-top-left-radius: .375rem;
    border-bottom-left-radius: .375rem;
}

table thead tr th, table tfoot tr th {
    font-weight: 600;
}

table thead tr th:where([dir="ltr"],[dir="ltr"] *), table tfoot tr th:where([dir="ltr"],[dir="ltr"] *), table tbody tr td:where([dir="ltr"],[dir="ltr"] *) {
    text-align: left;
}

table>thead>tr>th, table>tbody>tr>td {
    padding: .75rem 1rem !important;
    font-size: .875rem;
    line-height: 1.25rem;
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


.ltr\:mr-2:where([dir="ltr"],[dir="ltr"] *) {
    margin-right: .5rem 8px;
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
.btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .375rem;
    border-width: 1px;
    padding: .5rem 1.25rem;
    font-size: .875rem;
    line-height: 1.25rem;
    font-weight: 600;
    --tw-shadow: 0 10px 20px -10px;
    --tw-shadow-colored: 0 10px 20px -10px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    transition-duration: .3s;
}

.text-success {
    --tw-text-opacity: 1;
    color: rgb(0 171 85 / var(--tw-text-opacity));
}

.text-danger {
    --tw-text-opacity: 1;
    color: rgb(231 81 90 / var(--tw-text-opacity));
}

.buttonList, [type="button"], [type="reset"], [type="submit"] {
    appearance: button;
    background-color: transparent;
    background-image: none;
}

.btn-success {
    --tw-border-opacity: 1;
    border-color: rgb(0 171 85 / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: rgb(0 171 85 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
    --tw-shadow-color: rgb(0 171 85 / .6);
    --tw-shadow: var(--tw-shadow-colored);
}

.btn-danger {
    --tw-border-opacity: 1;
    --tw-bg-opacity: 1;
    background-color: rgb(231 81 90 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity));
    --tw-shadow-color: rgb(231 81 90 / .6);
    --tw-shadow: var(--tw-shadow-colored);
    border-color: rgb(231 81 90 / var(--tw-border-opacity));
}

.form-input, .form-textarea, .form-select, .form-multiselect {
    width: 100%;
    border-radius: .375rem;
    border-width: 1px;
    --tw-border-opacity: 1;
    border-color: rgb(224 230 237 / var(--tw-border-opacity));
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    padding: .5rem 1rem;
    font-size: .875rem;
    line-height: 1.25rem;
    font-weight: 600;
    --tw-text-opacity: 1;
    color: rgb(14 23 38 / var(--tw-text-opacity));
    outline: 2px solid transparent !important;
    outline-offset: 2px !important;
}

.ml-14{
    margin-left: 14px;
}

.mt-24{
    margin-top: 24px;
}

.mb-24{
    margin-bottom: 24px;
}


/* Modal general */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9999;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Botones del formulario */
.form-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
}

.form-actions button {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 120px;
}

/* === ESTILOS UNIFICADOS CON ABOUT.VUE === */
  .admin-card > * { position: relative; z-index: 1; }
  .futuristic-bg {
    background: linear-gradient(120deg, #ffe6b3 0%, #fff6e6 100%);
    min-height: 100vh;
    padding: 2rem 0;
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
.filter-container {
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;
}
.productos-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.productos-table th,
.productos-table td {
  border: 1.5px solid #f7c59f;
  padding: 0.5rem;
  text-align: center;
}
.productos-table th {
  background: linear-gradient(90deg, #b3e6ff 0%, #a3c8f7 100%);
  color: #4a6fa5;
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
.buttonList:hover {
  color: #28a745;
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
.modal-nuevo-registro .form-input,
.modal-nuevo-registro select {
  padding: 0.7rem;
  border: 1.5px solid #a3c8f7;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  background: #f8fafc;
}
.modal-nuevo-registro .form-input:focus,
.modal-nuevo-registro select:focus {
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
  min-width: 220px;
  max-width: 320px;
  flex: 1 1 220px;
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

@media (max-width: 900px) {
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
  .productos-table {
    font-size: 12px;
    min-width: 600px;
  }
}

 .btn-primary {
    background: linear-gradient(90deg, #b3e6ff 0%, #a3c8f7 100%);
    color: #226488;
  }
  .btn-primary:hover {
    background: #a3c8f7;
    color: #17405c;
  }
</style>
  