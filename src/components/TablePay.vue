<template>
  
    <!-- Card -->
                <div class="pay-card-home">
                    <div class="pay-card-header-home">
                        <span class="pay-card-title-home">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" class="pay-card-mainicon-home">
                                <rect x="3" y="5" width="18" height="14" rx="4" fill="#e6f7ff"/>
                                <path d="M7 12h10" stroke="#00bac7" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Ingresos por Tipo de Pago
                        </span>
                    </div>
                    <div class="pay-table-responsive-home">
                        <table class="pay-table-home">
                            <thead>
                                <tr>
                                    <th>Tipo de Pago</th>
                                    <th>Total</th>
                                    <th>Cantidad</th>
                                    <th>Porcentaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in resumenPagos" :key="index" :class="['pay-row-home', item.tipo.toLowerCase()]">
                                    <td class="pay-type-home">
                                        <span class="pay-type-icon-home">
                                            <svg v-if="item.tipo==='EFECTIVO'" width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" fill="#ffe6b3"/><rect x="7" y="11" width="10" height="2" rx="1" fill="#00bac7"/></svg>
                                            <svg v-else-if="item.tipo==='PLIN'" width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#b3e6ff"/><path d="M8 12h8" stroke="#00bac7" stroke-width="2" stroke-linecap="round"/></svg>
                                            <svg v-else-if="item.tipo==='TRANSFERENCIA'" width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="2" fill="#e6f7ff"/><path d="M8 12h8" stroke="#00bac7" stroke-width="2" stroke-linecap="round"/></svg>
                                            <svg v-else width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#ffe6b3"/><path d="M8 12h8" stroke="#00bac7" stroke-width="2" stroke-linecap="round"/></svg>
                                        </span>
                                        <span class="pay-type-label-home">{{ item.tipo }}</span>
                                    </td>
                                    <td class="pay-total-home"><span class="pay-badge-home pay-badge-total-home highlight-badge">{{ item.total }}</span></td>
                                    <td class="pay-qty-home"><span class="pay-badge-home pay-badge-qty-home">{{ item.cantidad }}</span></td>
                                    <td class="pay-pct-home">
                                        <div class="pay-progress-bar-home">
                                            <div class="pay-progress-home" :style="{ width: item.porcentaje + '%' }"></div>
                                            <span class="pay-badge-home pay-badge-pct-home">{{ item.porcentaje }}%</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
    const res = await fetch(`${API_BASE_URL}api/boletas`)
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

/* --- Home-aligned card for TablePay --- */
.pay-card-home {
    background: linear-gradient(120deg, #fff6e6 0%, #ffe6b3 100%);
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.10);
    border: 2px solid #f7c59f22;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.7rem 1.5rem 1.2rem 1.5rem;
    gap: 0.7rem;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.18s;
    margin-bottom: 1.5rem;
}
.pay-card-header-home {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}
.pay-card-title-home {
    font-size: 1.1rem;
    font-weight: 700;
    color: #226488;
    display: flex;
    align-items: center;
    gap: 8px;
}
.pay-card-mainicon-home {
    opacity: 0.5;
}
.pay-table-responsive-home {
    overflow-x: auto;
    width: 100%;
}
.pay-table-home {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 4px;
}
.pay-table-home th {
    background: #e6f7ff;
    color: #226488;
    font-size: 0.93rem;
    font-weight: 600;
    border: none;
    padding: 0.6rem 0.9rem;
    text-align: left;
    border-radius: 6px 6px 0 0;
}
.pay-table-home td {
    background: transparent;
    font-size: 0.98rem;
    border: none;
    padding: 0.7rem 0.9rem;
    border-radius: 0 0 6px 6px;
    vertical-align: middle;
    box-shadow: none;
}
.pay-type-home {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #0e2238;
    font-weight: 500;
}
.pay-total-home, .pay-qty-home {
    text-align: center;
}
.pay-pct-home {
    text-align: right;
}
.pay-badge-home {
    display: inline-block;
    border-radius: 8px;
    font-size: 0.98rem;
    font-weight: 600;
    padding: 0.18rem 0.7rem;
    box-shadow: 0 1px 4px #b3e6ff22;
    border: 1.5px solid #b3e6ff;
    letter-spacing: 0.01em;
}
.pay-badge-total-home {
    background: #b3e6ff;
    color: #226488;
    border-color: #b3e6ff;
}
.pay-badge-qty-home {
    background: #ffe6b3;
    color: #b8860b;
    border-color: #ffe6b3;
}
.pay-badge-pct-home {
    background: #e6f7ff;
    color: #226488;
    border-color: #b3e6ff;
    margin-left: 0.7em;
    min-width: 48px;
    text-align: center;
}
.pay-progress-bar-home {
    display: flex;
    align-items: center;
    gap: 0.5em;
}
.pay-progress-home {
    height: 10px;
    border-radius: 6px;
    background: linear-gradient(90deg, #b3e6ff 0%, #00bac7 100%);
    transition: width 0.6s cubic-bezier(.4,2.3,.3,1);
    min-width: 32px;
}

/* --- Mejoras visuales para la tabla --- */
.pay-row-home {
    background: #f9fbfd;
    box-shadow: 0 2px 8px #b3e6ff11;
    border-left: 6px solid #b3e6ff;
    transition: box-shadow 0.18s, border-color 0.18s;
}
.pay-row-home.efectivo { border-color: #ffe6b3; background: #fffaf3; }
.pay-row-home.plin { border-color: #b3e6ff; background: #f6fbff; }
.pay-row-home.transferencia { border-color: #e6f7ff; background: #f7fcfd; }
.pay-row-home:hover {
    box-shadow: 0 6px 18px #b3e6ff33;
    background: #fafdff;
}
.pay-type-icon-home {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #e6f7ff;
    margin-right: 8px;
}
.pay-type-label-home {
    font-weight: 600;
    color: #226488;
    font-size: 1.05rem;
}
.highlight-badge {
    font-size: 1.13rem;
    font-weight: 700;
    background: #fff6e6 !important;
    color: #b8860b !important;
    border-color: #ffe6b3 !important;
    box-shadow: 0 2px 8px #ffe6b344;
}
  

</style>
