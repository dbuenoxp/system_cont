<template>
    <div class="card border-0 flex-fill w-100">
         <div class="card-header border-0 border-0 card-header-space-between">
             <h2 class="card-header-title h4 text-uppercase">Ranking</h2>
             <a href="javascript: void(0);" class="small fw-bold">Ver Todo</a>
         </div>
 
         <div class="table-responsive">
             <table class="table table-sm table-borderless align-middle mb-0">
                 <thead class="thead-light">
                     <tr>
                         <th class="text-body-secondary list-sort">Name</th>
                         <th class="text-body-secondary list-sort">Visitas</th>
                     </tr>
                 </thead>
                 <tbody>
                     <tr v-for="(cliente, index) in topClientes" :key="index">
                         <td>
                             <div class="d-flex align-items-center">
                                 <div class="d-flex flex-column">
                                     <span class="fw-bold d-block">{{ cliente.nombre }}</span>
                                     <span class="fs-6 text-body-secondary">{{ cliente.tiempo }}</span>
                                 </div>
                             </div>
                         </td>
                         <td class="text-end">
                             <div class="fw-bold">{{ cliente.visitas }}</div>
                         </td>
                     </tr>
                 </tbody>
             </table>
         </div>
     </div>
 </template>
 
 <script setup>
 import { ref, onMounted } from 'vue'
 
 const topClientes = ref([])
 
 function formatearTiempo(minutos) {
   const horas = Math.floor(minutos / 60)
   const mins = minutos % 60
   if (horas > 0 && mins > 0) return `${horas}h ${mins}min`
   if (horas > 0) return `${horas} horas`
   return `${mins} minutos`
 }
 
 async function fetchPlayers() {
   try {
     const res = await fetch('http://localhost:3000/players/ranking')
     return await res.json()
   } catch (error) {
     console.error('Error al obtener jugadores:', error)
     return []
   }
 }
 
 onMounted(async () => {
  const data = await fetchPlayers()
  const resultado = data
    .map(cliente => ({
      nombre: `${cliente.nombre} ${cliente.apellido}`,
      visitas: cliente.cantidadVisitas,
      tiempo: formatearTiempo(cliente.tiempoTotal)
    }))
    .sort((a, b) => b.visitas - a.visitas)
    .slice(0, 5)

  topClientes.value = resultado
 })
 </script>
<style scoped>

.card {
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
}

.card-header:first-child {
    border-radius: var(--bs-card-inner-border-radius) var(--bs-card-inner-border-radius) 0 0;
}

.card-header-space-between {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.border-0 {
    border: 0 !important;
}

.d-block {
    display: block !important;
}

.flex-fill {
    flex: 1 1 auto !important;
}

.w-100 {
    width: 100% !important;
}

.card-header {
    background-color: var(--bs-card-cap-bg);
    border-bottom: var(--bs-card-border-width) solid var(--bs-card-border-color);
    color: var(--bs-card-cap-color);
    margin-bottom: 0;
}

.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table {
    --bs-border-color: #f4f4f4;
    --bs-table-border-color: var(--bs-border-color);
}

.fs-6 {
    font-size: .625rem !important;
}

.mb-0 {
    margin-bottom: 0 !important;
}

.align-middle {
    vertical-align: middle !important;
}

table{
    border-collapse: collapse;
    caption-side: bottom;
}

.table>thead {
    vertical-align: bottom;
}

.thead-light {
    background-color: rgba(120 217 227);
}

tbody, td, tfoot, th, thead, tr {
    border: 0 solid;
    border-color: inherit;
}

.table>thead th {
    border-bottom-width: 0;
    color: rgba(14,34,56, .3525);
    font-size: .75rem;
    padding: .5rem 1.25rem;
}

[data-sort]:after, [data-sort]:before {
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: 9px 4px;
    content: "";
    height: 4px;
    left: calc(100% + 5px);
    margin-left: 1.3125em;
    opacity: .4;
    position: absolute;
    top: 50%;
    vertical-align: .6375em;
    width: 9px;
}


.table>tbody {
    vertical-align: inherit;
}

.table-nowrap td, .table-nowrap th {
    white-space: nowrap;
}

.fw-bold, .fw-bolder {
    font-weight: 700 !important;
}

[data-sort] {
    position: relative;
}

.text-body-secondary{
    --bs-text-opacity: 1;
    color: #092c4a !important;
}

a, button {
    outline: 0 !important;
}

.text-end {
    text-align: right !important;
}

.min-w-200px {
    min-width: 200px !important;
}

.pe-7 {
    padding-right: 2.8125rem !important;
}

.text-body-secondary {
    --bs-text-opacity1: 1;
    color: var(--bs-secondary-color) !important;
}

.table>:not(caption)>*>* {
    background-color: var(--bs-table-bg);
    border-bottom-width: var(--bs-border-width);
    box-shadow: inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));
    color: var(--bs-table-color-state, var(--bs-table-color-type, var(--bs-table-color)));
    padding: 1rem 1.25rem;
}

.align-items-center {
    align-items: center !important;
}

.justify-content-between{
    justify-content: space-between !important;
}

.progress {
    box-shadow: none;
}

.flex-grow-1 {
    flex-grow: 1 !important;
}

.flex-column {
    flex-direction: column !important;
}

.d-flex {
    display: flex !important;
}

.bg-dark {
    --bs-bg-opacity: 1;
    background-color: rgba(14,34,56, var(--bs-bg-opacity)) !important;
}

.ms-3 {
    margin-left: .624999375rem !important;
}
.progress-bar {
    background-color: var(--bs-progress-bar-bg);
    color: var(--bs-progress-bar-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    text-align: center;
    transition: var(--bs-progress-bar-transition);
    white-space: nowrap;
}

.progress, .progress-stacked {
    --bs-progress-height: 0.75rem;
    --bs-progress-font-size: 0.65625rem;
    --bs-progress-bg: var(--bs-gray-300);
    --bs-progress-border-radius: 0.625rem;
    --bs-progress-box-shadow: var(--bs-box-shadow-inset);
    --bs-progress-bar-color: #fff;
    --bs-progress-bar-bg: #00bac7;
    --bs-progress-bar-transition: width 0.6s ease;
    background-color: #c3cde3;
    border-radius: var(--bs-progress-border-radius);
    box-shadow: var(--bs-progress-box-shadow);
    display: flex;
    font-size: var(--bs-progress-font-size);
    height: var(--bs-progress-height);
    overflow: hidden;
}

.card{
    --bs-card-spacer-y: 0.2500000001rem;
    --bs-card-spacer-x: 1.2500000001rem;
    --bs-card-title-spacer-y: 0.9375rem;
    --bs-card-title-color: ;
    --bs-card-subtitle-color: ;
    --bs-card-border-width: 1px;
    --bs-card-border-color: var(--bs-border-color-translucent);
    --bs-card-border-radius: var(--bs-border-radius);
    --bs-card-box-shadow: 0 0.1875rem 0.1875rem 0 rgba(14, 34, 56, .07);
    --bs-card-inner-border-radius: calc(0.625rem - 1px);
    --bs-card-cap-padding-y: 1.2500000001rem;
    --bs-card-cap-padding-x: 1.2500000001rem;
    --bs-card-cap-bg: transparent;
    --bs-card-cap-color: ;
    --bs-card-height: ;
    --bs-card-color: ;
    --bs-card-bg: #fff;
    --bs-card-img-overlay-padding: 1.875rem;
    --bs-card-group-margin: 0.9375rem;
    color: var(--bs-body-color);
    display: flex;
    flex-direction: column;
    height: var(--bs-card-height);
    min-width: 0;
    position: relative;
    word-wrap: break-word;
    background: linear-gradient(90deg, rgb(209 225 250) 0%, rgb(249 224 198) 50%, rgb(249 206 190) 100%);
    background-clip: border-box;
    background-color: lightblue;
    border: var(--bs-card-border-width) solid var(--bs-card-border-color);
    /* border-radius: var(--bs-card-border-radius); */
}

.table {
    --bs-emphasis-color: #000;
    --bs-table-color-type: initial;
    --bs-table-bg-type: initial;
    --bs-table-color-state: initial;
    --bs-table-bg-state: initial;
    --bs-table-color: var(--bs-emphasis-color);
    --bs-table-bg: transparent;
    --bs-table-accent-bg: transparent;
    --bs-table-striped-color: var(--bs-emphasis-color);
    --bs-table-striped-bg: rgba(var(--bs-emphasis-color-rgb), 0.05);
    --bs-table-active-color: var(--bs-emphasis-color);
    --bs-table-active-bg: rgba(0, 186, 199, .1);
    --bs-table-hover-color: var(--bs-emphasis-color);
    --bs-table-hover-bg: rgba(0, 186, 199, .1);
    border-color: var(--bs-table-border-color);
    margin-bottom: 1.875rem;
    vertical-align: top;
    width: 100%;
}

</style>