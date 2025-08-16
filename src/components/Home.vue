<template>
  <!-- <div class="background-layer"></div> -->
    <div class="min-h-screen bg-gray-100 p-6 space-y-6">
      <!-- Fila 1: Cards estadísticas -->
      <div class="row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardTemplate title="Clientes" :mainValue="mainValue" :sub1="sub1" :sub2="sub2" ></CardTemplate>
        <CardTemplate style="margin-left: 24px;" title="Tiempo de Juego" :mainValue="totalTiempo" :sub1="tiempoHoy" :sub2="tiempoMes"> </CardTemplate>
        <CardTemplate style="margin-left: 24px;" title="Ganancias" :mainValue="totalGanancia" :sub1="gananciaHoy" :sub2="gananciaMes"> </CardTemplate>
      </div>
      
      <!-- Fila 2: Tabla y Ranking -->
      <div class="row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style="display: flex;margin-top: 24px;;margin-left: 0px;">
         <div class="row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style="display: flex;margin-right: 24px;">      
            <TablePay></TablePay>
         </div> 
        <div class="bg-white rounded-xl shadow-md p-6 border-gray-100">
          <Ranking></Ranking>
        </div>
      </div>
  
      <!-- Fila 3: Calendario -->
      <!-- <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 class="text-gray-800 font-bold mb-4">Calendario</h3>
        <div class="h-[400px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 italic">
          Aquí irá el calendario (librería como `vue-cal` o `fullcalendar`)
        </div>
      </div> -->
    </div>
  </template>
  
  <script setup>
  import CardStats from '../components/CardStats.vue'
  import CardTemplate from '../components/CardTemplate.vue'
  import TablePay from '../components/TablePay.vue'
  import Ranking from '../components/Ranking.vue'
  import { ref, onMounted } from 'vue'
  
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
      const res = await fetch('http://localhost:3000/players')
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
    const res = await fetch('http://localhost:3000/api/boletas')
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
  .background-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/images/background.jpeg');
    background-size: cover;
    background-position: center;
    opacity: 0.3;
    z-index: -1;
  }
  
  .row {
      --bs-gutter-x: 1.875rem;
      --bs-gutter-y: 0;
      display: flex;
      flex-wrap: nowrap;
      margin-left: calc(var(--bs-gutter-x) * -.5);
      margin-right: calc(var(--bs-gutter-x) * -.5);
      margin-top: calc(var(--bs-gutter-y) * -1);
  }
  
  .d-flex {
      display: flex !important;
  }
  
  @media (min-width: 1400px) {
      .col-xxl-9 {
          flex: 0 0 auto;
          width: 75%;
      }
  }
  
  @media (min-width: 1400px) {
      .col-xxl-3 {
          flex: 0 0 auto;
          width: 25%;
      }
  }
  </style>
  