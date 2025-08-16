<template>
    <div class="admin-card">
      <h1 class="title">Gestión de Productos</h1>
  
      <!-- Filtros y botones -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">Nombre:</label>
          <input v-model="filtroNombre" type="text" placeholder="Buscar producto..."
                 class="form-input ml-14" />
        </div>
        <div class="flex gap-2">
          <button class="btn btn-success ml-14" @click="showModal = true">➕ Nuevo</button>
          <button class="btn btn-secondary ml-14" @click="exportarExcel">📤 Exportar</button>
        </div>
      </div>
  
      <!-- Lista de productos -->
      <table class="w-full table-auto border mt-24">
        <thead>
          <tr class="bg-gray-200 text-left text-sm">
            <th class="p-2">Nombre</th>
            <th class="p-2">Categoría</th>
            <th class="p-2">Stock Disponible</th>
            <th class="p-2">Precio</th>
            <th class="p-2" style="text-align: center;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in productosFiltrados" :key="p.id" class="text-sm border-t">
            <td class="p-2">{{ p.nombre }}</td>
            <td class="p-2">{{ p.categoria }}</td>
            <td class="p-2">{{ p.stock }}</td>
            <td class="p-2">S/ {{ p.precio }}</td>
            <td class="p-2 flex gap-2">
              <button type="button" class="buttonList" @click="editarProducto(p.id)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-success"><path d="M15.2869 3.15178L14.3601 4.07866L5.83882 12.5999L5.83881 12.5999C5.26166 13.1771 4.97308 13.4656 4.7249 13.7838C4.43213 14.1592 4.18114 14.5653 3.97634 14.995C3.80273 15.3593 3.67368 15.7465 3.41556 16.5208L2.32181 19.8021L2.05445 20.6042C1.92743 20.9852 2.0266 21.4053 2.31063 21.6894C2.59466 21.9734 3.01478 22.0726 3.39584 21.9456L4.19792 21.6782L7.47918 20.5844L7.47919 20.5844C8.25353 20.3263 8.6407 20.1973 9.00498 20.0237C9.43469 19.8189 9.84082 19.5679 10.2162 19.2751C10.5344 19.0269 10.8229 18.7383 11.4001 18.1612L11.4001 18.1612L19.9213 9.63993L20.8482 8.71306C22.3839 7.17735 22.3839 4.68748 20.8482 3.15178C19.3125 1.61607 16.8226 1.61607 15.2869 3.15178Z" stroke="currentColor" stroke-width="1.5"></path><path opacity="0.5" d="M14.36 4.07812C14.36 4.07812 14.4759 6.04774 16.2138 7.78564C17.9517 9.52354 19.9213 9.6394 19.9213 9.6394M4.19789 21.6777L2.32178 19.8015" stroke="currentColor" stroke-width="1.5"></path></svg>
              </button>
              <!-- <button @click="editarProducto(index)" title="Editar">
                ✏️
              </button> -->
              <button type="button" class="buttonList" @click="eliminar(p.id)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-danger"><path d="M20.5001 6H3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path opacity="0.5" d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="currentColor" stroke-width="1.5"></path></svg>
              </button>
              <!-- <button @click="eliminarProducto(index)" title="Eliminar">
                🗑️
              </button> -->
            </td>
          </tr>
        </tbody>
      </table>
       <!-- Modal -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <h2 class="title">
          {{ modoEdicion ? 'Editar Producto' : 'Nuevo Producto' }}
        </h2>
        <form @submit.prevent="guardarProducto" class="form-grid">
        <div class="mb-3">
          <label class="block text-sm font-medium">Nombre del producto</label>
          <input v-model="form.nombre" type="text" class="form-input" />
        </div>
  
        <div class="mb-3">
          <label class="block text-sm font-medium">Categoría</label>
          <select v-model="form.categoria" class="form-input">
            <option value="Bebida">Bebida</option>
            <option value="Snack">Snack</option>
            <option value="Dulce">Dulce</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
  
        <div class="mb-3">
          <label class="block text-sm font-medium">Stock</label>
          <input v-model.number="form.stock" type="number" min="0" class="form-input" />
        </div>
  
        <div class="mb-4">
          <label class="block text-sm font-medium">Precio</label>
          <input v-model.number="form.precio" type="number" min="0" step="0.01" class="form-input" />
        </div>
  
        <div class="form-actions mt-24">  
          <button @click="showModal = false" class="btn-danger">Cancelar</button>
          <button type="submit" class="btn-success ml-14">Guardar</button>
        </div>
      </form>
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
      const response = await fetch('http://localhost:3000/products')
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
        const res = await fetch(`http://localhost:3000/products/${form.value.id}`, {
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
        const res = await fetch('http://localhost:3000/products', {
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

  // function eliminarProducto(index) {
  //   productos.value.splice(index, 1);
  //   guardarEnLocalStorage(); 
  // }

  // const eliminar = () => {
  //     if (deleteIndex.value !== null) {
  //       productos.value.splice(deleteIndex.value, 1)
  //       guardarEnLocalStorage()
  //     }
  //     showDeleteConfirm.value = false
  //     deleteIndex.value = null
  //   }

    const eliminar = async (id) => {
      if (!confirm('¿Seguro que deseas eliminar este producto?')) return
      try {
        await fetch(`http://localhost:3000/products/${id}`, {
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
  background: linear-gradient(90deg, rgb(209 225 250) 0%, rgb(249 224 198) 50%, rgb(249 206 190) 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 2rem;
  margin: 1rem auto;
  max-width: 1200px;
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

.title
 {
    color: #2c3e50;
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
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
</style>
  