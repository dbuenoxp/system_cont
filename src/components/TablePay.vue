<template>
  
    <!-- Card -->
    <div class="card border-0 flex-fill w-100" data-list="{&quot;valueNames&quot;: [&quot;name&quot;, &quot;price&quot;, &quot;quantity&quot;, &quot;amount&quot;, {&quot;name&quot;: &quot;sales&quot;, &quot;attr&quot;: &quot;data-sales&quot;}], &quot;page&quot;: 5}" id="topSellingProducts">
        <div class="card-header border-0 card-header-space-between">

            <!-- Title -->
            <h2 class="card-header-title h4 text-uppercase">
                Ingresos
            </h2>
        </div>

        <!-- Table -->
        <div class="table-responsive">
            <table class="table align-middle table-edge table-nowrap mb-0">
                <thead class="thead-light">
                    <tr>
                        <th>
                            <a href="javascript: void(0);" class="text-body-secondary list-sort" data-sort="name">
                                Tipo de Pago
                            </a>
                        </th>
                        <th class="text-end">
                            <a href="javascript: void(0);" class="text-body-secondary list-sort" data-sort="price">
                                Total
                            </a>
                        </th>
                        <th class="text-end">
                            <a href="javascript: void(0);" class="text-body-secondary list-sort" data-sort="quantity">
                                Cantidad
                            </a>
                        </th>
                        <th class="pe-7 min-w-200px">
                            <a href="javascript: void(0);" class="text-body-secondary list-sort" data-sort="sales">
                                Porcentaje
                            </a>
                        </th>
                    </tr>
                </thead>

                <tbody class="list">
                    <tr v-for="(item, index) in resumenPagos" :key="index">
                        <td class="name fw-bold">{{ item.tipo }}</td>
                        <td class="price text-end">{{ item.total }}</td>
                        <td class="quantity text-end">{{ item.cantidad }}</td>
                        <td class="sales" :data-sales="item.porcentaje">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="progress d-flex flex-grow-1">
                                    <div class="progress-bar" role="progressbar" :style="{ width: item.porcentaje + '%' }" :aria-valuenow="item.porcentaje" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <span class="ms-3 text-body-secondary">{{ item.porcentaje }}%</span>
                            </div>
                        </td>
                    </tr>
                    <!-- <tr>
                        <td class="name fw-bold">Efectivo</td>
                        <td class="price text-end">S/ 499.00</td>
                        <td class="quantity text-end">127</td>
                        <td class="sales" data-sales="25">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="progress w-100">
                                    <div class="progress-bar bg-dark" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <span class="ms-3 text-body-secondary">25%</span>
                            </div>
                        </td>
                    </tr><tr>
                        <td class="name fw-bold">PLIN</td>
                        <td class="price text-end">S/ 349.00</td>
                        <td class="quantity text-end">98</td>
                        <td class="sales" data-sales="41">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="progress w-100">
                                    <div class="progress-bar bg-dark" role="progressbar" style="width: 41%" aria-valuenow="41" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <span class="ms-3 text-body-secondary">41%</span>
                            </div>
                        </td>
                    </tr><tr>
                        <td class="name fw-bold">Transferencia</td>
                        <td class="price text-end">S/ 599.00</td>
                        <td class="quantity text-end">214</td>
                        <td class="sales" data-sales="50">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="progress w-100">
                                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <span class="ms-3 text-body-secondary">50%</span>
                            </div>
                        </td>
                    </tr> -->
                </tbody>
            </table>
        </div> <!-- / .table-responsive -->
    </div>
  
</template>
<script setup>
import { ref, onMounted } from 'vue'

const resumenPagos = ref([])

function calcularResumen(boletas) {
  const pagadas = boletas
  const totales = {}
  let totalTransacciones = 0

  pagadas.forEach(b => {
    const tipoPago = b.tipoPago?.trim().toUpperCase() || 'OTROS'
    if (!totales[tipoPago]) {
      totales[tipoPago] = { total: 0, cantidad: 0 }
    }
    totales[tipoPago].total += b.total || 0
    totales[tipoPago].cantidad += 1
    totalTransacciones += 1
  })

  const resultado = Object.entries(totales)
    .map(([tipo, info]) => ({
      tipo,
      total: `S/. ${info.total.toFixed(2)}`,
      cantidad: info.cantidad,
      porcentaje: Math.round((info.cantidad / totalTransacciones) * 100)
    }))
    .sort((a, b) => b.cantidad - a.cantidad)

  resumenPagos.value = resultado
}

async function fetchBoletas() {
  try {
    const res = await fetch('http://localhost:3000/api/boletas')
    const data = await res.json()
    calcularResumen(data)
  } catch (error) {
    console.error('Error al obtener boletas:', error)
  }
}

onMounted(() => {
  fetchBoletas()
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
    color: #092c4a;
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
