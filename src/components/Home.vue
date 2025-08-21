<template>
  <!-- <div class="background-layer"></div> -->
  <div class="admin-view futuristic-card">
    <div class="container-home">
      <!-- Estadísticas principales -->
      <div class="stats-stack">
        <div class="stat-stack-card clientes">
          <div class="icon-bg">👥</div>
          <div class="stat-stack-content">
            <div class="stat-stack-title">Clientes</div>
            <div class="stat-stack-main">{{ mainValue }}</div>
            <div class="stat-stack-badges">
              <span class="badge badge-hoy">Hoy: {{ sub1 }}</span>
              <span class="badge badge-mes">Mes: {{ sub2 }}</span>
            </div>
          </div>
        </div>
        <div class="stat-stack-card tiempo">
          <div class="icon-bg">⏱️</div>
          <div class="stat-stack-content">
            <div class="stat-stack-title">Tiempo de Juego</div>
            <div class="stat-stack-main">{{ totalTiempo }}</div>
            <div class="stat-stack-badges">
              <span class="badge badge-hoy">Hoy: {{ tiempoHoy }}</span>
              <span class="badge badge-mes">Mes: {{ tiempoMes }}</span>
            </div>
          </div>
        </div>
        <div class="stat-stack-card ganancias">
          <div class="icon-bg">💰</div>
          <div class="stat-stack-content">
            <div class="stat-stack-title">Ganancias</div>
            <div class="stat-stack-main">{{ totalGanancia }}</div>
            <div class="stat-stack-badges">
              <span class="badge badge-hoy">Hoy: {{ gananciaHoy }}</span>
              <span class="badge badge-mes">Mes: {{ gananciaMes }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Ingresos y Ranking -->
      <div class="content-row">
        <div class="card-table">
          <TablePay />
        </div>
        <div class="card-ranking">
          <Ranking />
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import CardStats from '../components/CardStats.vue'
  import CardTemplate from '../components/CardTemplate.vue'
  import TablePay from '../components/TablePay.vue'
  import Ranking from '../components/Ranking.vue'
    import { ref, onMounted, computed } from 'vue'
    import { API_BASE_URL } from '../env.js'
  
  const mainValue = ref(0)
  const sub1 = ref(0) 
  const sub2 = ref(0)
  
  const totalTiempo = ref(0)
  totalTiempo.value = 0
  const tiempoHoy = ref(0)
  const tiempoMes = ref(0)
  
  const totalGanancia = ref(0)
  const gananciaHoy = ref(0)
  const gananciaMes = ref(0)
  
  async function fetchPlayers() {
    try {
  const res = await fetch(`${API_BASE_URL}players`)
      return await res.json()
    } catch (err) {
      console.error('Error al obtener jugadores:', err)
      return []
    }
  }
  
  async function cargarEstadisticasClientes() {
    const players = await fetchPlayers()
    const now = new Date()
    const hoy = now.toISOString().slice(0, 10)
    const mesActual = now.getMonth()
    const anioActual = now.getFullYear()
  
    let total = players.length
    let cantidadHoy = 0
    let cantidadMes = 0
  
    players.forEach(player => {
      const entrada = new Date(player.entrada)
      const entradaStr = entrada.toISOString().slice(0, 10)
  
      if (entradaStr === hoy) cantidadHoy++
      if (entrada.getMonth() === mesActual && entrada.getFullYear() === anioActual) {
        cantidadMes++
      }
    })
  
    mainValue.value = total
    sub1.value = cantidadHoy
    sub2.value = cantidadMes
  }
  
  async function cargarEstadisticasTiempo() {
    const players = await fetchPlayers()
    const now = new Date()
    const hoy = now.toISOString().slice(0, 10)
    const mesActual = now.getMonth()
    const anioActual = now.getFullYear()
  
    let total = 0
    let hoyTotal = 0
    let mesTotal = 0
  
    players.forEach(player => {
      const entrada = new Date(player.entrada)
      const entradaStr = entrada.toISOString().slice(0, 10)
  
      const tiempo = Number(player.tiempo) || 0
      total += tiempo
  
      if (entradaStr === hoy) hoyTotal += tiempo
      if (entrada.getMonth() === mesActual && entrada.getFullYear() === anioActual) {
        mesTotal += tiempo
      }
    })
  
    totalTiempo.value = formatearTiempo(total)
    tiempoHoy.value = formatearTiempo(hoyTotal)
    tiempoMes.value = formatearTiempo(mesTotal)
  }
  
  function formatearTiempo(minutos) {
    const horas = Math.floor(minutos / 60)
    const mins = minutos % 60
    return `${horas > 0 ? horas + 'h ' : ''}${mins}min`
  }

  async function fetchBoletas() {
  try {
  const res = await fetch(`${API_BASE_URL}api/boletas`)
    return await res.json()
  } catch (error) {
    console.error('Error al obtener boletas:', error)
    return []
  }
}
  
  async function cargarGananciasTotales() {
  const boletas = await fetchBoletas()
  const pagadas = boletas

  const hoy = new Date()
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

  let total = 0
  let hoyTotal = 0
  let mesTotal = 0

  pagadas.forEach((b) => {
    const fecha = new Date(b.fechaHora)
    total += b.total || 0

    if (fecha.toDateString() === hoy.toDateString()) {
      hoyTotal += b.total
    }

    if (fecha >= inicioMes) {
      mesTotal += b.total
    }
  })

  totalGanancia.value = formatearMonto(total)
  gananciaHoy.value = formatearMonto(hoyTotal)
  gananciaMes.value = formatearMonto(mesTotal)
  }
  
  function formatearMonto(monto) {
    return `S/. ${monto.toFixed(2)}`
  }
  
  onMounted(() => {
    cargarEstadisticasClientes()
    cargarEstadisticasTiempo()
    cargarGananciasTotales()
  })
  </script>
  
  <style scoped>
  .container-home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 1.2rem 2rem 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
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

  .stats-stack {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    justify-content: space-between;
    align-items: stretch;
    margin-bottom: 1.5rem;
    width: 100%;
  }
  .stat-stack-card {
    flex: 1 1 0;
    min-width: 220px;
    max-width: 340px;
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
  }
  .stat-stack-card:hover {
    box-shadow: 0 8px 32px #b3e6ff33;
  }
  .icon-bg {
    position: absolute;
    top: -18px;
    right: -18px;
    font-size: 4.2rem;
    opacity: 0.13;
    pointer-events: none;
    z-index: 0;
  }
  .stat-stack-content {
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .stat-stack-title {
    font-size: 1.1rem;
    color: #226488;
    font-weight: 600;
    margin-bottom: 0.2rem;
    letter-spacing: 0.04em;
  }
  .stat-stack-main {
    font-size: 2.3rem;
    font-weight: bold;
    color: #17405c;
    margin-bottom: 0.2rem;
  }
  .stat-stack-badges {
    display: flex;
    flex-direction: row;
    gap: 0.7rem;
    margin-top: 0.2rem;
  }
  .badge {
    font-size: 0.98rem;
    font-weight: 600;
    border-radius: 8px;
    padding: 0.18rem 0.7rem;
    background: #e6f7ff;
    color: #226488;
    box-shadow: 0 1px 4px #b3e6ff22;
    border: 1.5px solid #b3e6ff;
    letter-spacing: 0.01em;
  }
  .badge-hoy {
    background: #ffe6b3;
    color: #b8860b;
    border-color: #ffe6b3;
  }
  .badge-mes {
    background: #b3e6ff;
    color: #226488;
    border-color: #b3e6ff;
  }
  .stat-stack-card.clientes {
    background: linear-gradient(120deg, #e6f7ff 0%, #b3e6ff 100%);
  }
  .stat-stack-card.tiempo {
    background: linear-gradient(120deg, #fff6e6 0%, #ffe6b3 100%);
  }
  .stat-stack-card.ganancias {
    background: linear-gradient(120deg, #b3ffd8 0%, #b3e6ff 100%);
  }
  @media (max-width: 900px) {
    .stats-stack {
      flex-direction: column;
      gap: 1.2rem;
    }
    .stat-stack-card {
      max-width: 100vw;
      min-width: 0;
      padding: 1.1rem 0.7rem 1rem 0.7rem;
    }
  }
  @media (max-width: 900px) {
    .stats-row-cards {
      flex-direction: column;
      gap: 1.2rem;
    }
    .stat-card.visual-card {
      max-width: 100vw;
      min-width: 0;
      padding: 1rem 0.7rem 1rem 0.7rem;
    }
  }
  .content-row {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: flex-start;
  }
  .card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.08);
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    border: 2px solid #f7c59f22;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
  .card-table {
    flex: 2 1 0;
    min-width: 320px;
    max-width: 100%;
  }
  .card-ranking {
    flex: 1 1 0;
    min-width: 260px;
    max-width: 400px;
  }
  @media (max-width: 900px) {
    .container-home {
      padding: 1.2rem 0.2rem 1rem 0.2rem;
      gap: 1.2rem;
    }
    .stats-row, .content-row {
      flex-direction: column;
      gap: 1.2rem;
    }
    .stat-card, .card-table, .card-ranking {
      min-width: 0;
      max-width: 100vw;
      margin: 0;
    }
    .card {
      padding: 1.2rem 0.7rem 1rem 0.7rem;
    }
  }
  </style>
  