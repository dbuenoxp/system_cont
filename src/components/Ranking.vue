<template>
<div class="ranking-card-home">
    <div class="ranking-header-home">
        <span class="ranking-title-home">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" class="ranking-trophy-icon"><path d="M12 2c-1.1 0-2 .9-2 2v1H6a1 1 0 0 0-1 1v2c0 3.87 3.13 7 7 7s7-3.13 7-7V6a1 1 0 0 0-1-1h-4V4c0-1.1-.9-2-2-2Zm0 2h0Zm-5 2h2v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6h2v2c0 3.31-2.69 6-6 6s-6-2.69-6-6V6Zm5 14.93V20h2v.93A8.014 8.014 0 0 1 12 22c-.34 0-.67-.02-1-.07Z" fill="#FFD700"/></svg>
            Ranking de Jugadores
        </span>
        <a href="javascript: void(0);" class="ranking-link-home">Ver Todo</a>
    </div>
    <div class="ranking-podium-home">
        <div v-for="(cliente, index) in topClientes.slice(0,3)" :key="'podio-'+index" :class="['podium-item', 'podium-'+(index+1)]">
            <div class="podium-icon">
                <span v-if="index === 0" class="trophy gold">🥇</span>
                <span v-else-if="index === 1" class="trophy silver">🥈</span>
                <span v-else class="trophy bronze">🥉</span>
            </div>
            <div class="podium-info">
                <span class="podium-name">{{ cliente.nombre }}</span>
            </div>
               <div class="podium-info">
                 <span class="podium-time">{{ cliente.tiempo }}</span>
               </div>
            <div class="podium-visitas">
                <span class="podium-visitas-badge">{{ cliente.visitas }}<span class="podium-visitas-label"> visitas</span></span>
            </div>
        </div>
    </div>
    <div class="ranking-list-home">
        <div v-for="(cliente, index) in topClientes.slice(3)" :key="'resto-'+index" class="ranking-item-home ranking-resto">
            <div class="ranking-pos-icon">
                <span class="medal">🎮</span>
            </div>
            <div class="ranking-info-home">
                <span class="ranking-name-home">{{ cliente.nombre }}</span>
                <span class="ranking-time-home">{{ cliente.tiempo }}</span>
            </div>
            <div class="ranking-visitas-home">
                <span class="ranking-visitas-badge">{{ cliente.visitas }}<span class="ranking-visitas-label"> visitas</span></span>
            </div>
        </div>
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
   return `${mins} min`
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
.ranking-podium-home {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    gap: 0.7rem;
    margin-bottom: 0.7rem;
}
.podium-item {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px #b3e6ff33;
    border: 2.5px solid #e6f7ff;
    padding: 1.1rem 0.7rem 0.8rem 0.7rem;
    min-width: 0;
    position: relative;
    animation: popin 0.7s cubic-bezier(.4,2.3,.3,1);
}
.podium-1 {
    background: linear-gradient(120deg, #fffbe6 0%, #ffe6b3 100%);
    border-color: #ffd70099;
    z-index: 2;
    transform: scale(1.08);
}
.podium-2 {
    background: linear-gradient(120deg, #e6f7ff 0%, #b3e6ff 100%);
    border-color: #b3e6ff99;
    z-index: 1;
}
.podium-3 {
    background: linear-gradient(120deg, #f7e6ff 0%, #e6b3ff 100%);
    border-color: #e6b3ff99;
    z-index: 1;
}

.podium-icon {
    font-size: 2.2rem;
    margin-bottom: 0.2rem;
}
.podium-name {
    font-weight: 700;
    color: #17405c;
    font-size: 1.13rem;
    text-align: center;
    margin-bottom: 0.1rem;
}
.podium-time {
    font-size: 0.99rem;
    color: #226488;
    opacity: 0.8;
    text-align: start;
    align-items: flex-start !important;
}
.podium-visitas {
    margin-top: 0.3rem;
}
.podium-visitas-badge {
    background: #ffe6b3;
    color: #b8860b;
    border-radius: 10px;
    font-size: 1.08rem;
    font-weight: 700;
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 3px;
    /* padding: 0.22rem 0.9rem; */
    box-shadow: 0 1px 4px #ffe6b344;
    border: 1.5px solid #ffe6b3;
    letter-spacing: 0.01em;
}
.podium-visitas-label {
    font-size: 0.93rem;
    color: #b8860b;
    opacity: 0.7;
    margin-left: 0.2em;
}
@keyframes popin {
    0% { transform: scale(0.7); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}
.ranking-resto {
    opacity: 0.85;
    background: #f9fbfd;
    border-radius: 10px;
    border: 1.5px solid #e6f7ff;
}

/* --- Card visual para Ranking --- */
.ranking-card-home {
    background: linear-gradient(120deg, #e6f7ff 0%, #fff6e6 100%);
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.10);
    border: 2px solid #b3e6ff44;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem 1.2rem 1.2rem 1.2rem;
    gap: 0.7rem;
    position: relative;
    overflow: hidden;
    margin-bottom: 1.5rem;
}
.ranking-header-home {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.7rem;
}
.ranking-title-home {
    font-size: 1.1rem;
    font-weight: 700;
    color: #226488;
    display: flex;
    align-items: center;
    gap: 8px;
}
.ranking-trophy-icon {
    vertical-align: middle;
    margin-right: 4px;
}
.ranking-link-home {
    font-size: 0.95rem;
    color: #00bac7;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
}
.ranking-list-home {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.ranking-item-home {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px #b3e6ff22;
    border: 1.5px solid #e6f7ff;
    padding: 0.7rem 1.1rem;
    gap: 1.2rem;
    transition: box-shadow 0.18s;
}
.ranking-item-home:hover {
    box-shadow: 0 6px 18px #b3e6ff33;
}
.ranking-pos-icon {
    width: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.7rem;
}
.trophy {
    font-size: 1.7rem;
    filter: drop-shadow(0 2px 4px #ffe6b355);
}
.trophy.gold { filter: drop-shadow(0 2px 4px #ffd70088); }
.trophy.silver { filter: drop-shadow(0 2px 4px #b3e6ff88); }
.trophy.bronze { filter: drop-shadow(0 2px 4px #e6b87a88); }
.medal {
    font-size: 1.3rem;
    opacity: 0.7;
}
.ranking-info-home {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}
.ranking-name-home {
    font-weight: 700;
    color: #17405c;
    font-size: 1.08rem;
}
.ranking-time-home {
    font-size: 0.97rem;
    color: #226488;
    opacity: 0.8;
}
.ranking-visitas-home {
    min-width: 90px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.ranking-visitas-badge {
    background: #b3e6ff;
    color: #226488;
    border-radius: 8px;
    font-size: 0.98rem;
    font-weight: 600;
    padding: 0.18rem 0.7rem;
    box-shadow: 0 1px 4px #b3e6ff22;
    border: 1.5px solid #b3e6ff;
    letter-spacing: 0.01em;
}
.ranking-visitas-label {
    font-size: 0.93rem;
    color: #226488;
    opacity: 0.7;
    margin-left: 0.2em;
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