<template>
  <!-- <Sidebar />
  <div class="main-content">
    <router-view />
  </div> -->
    <Sidebar />
    <div class="app-root">
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </template>

<script setup>
import Sidebar from './components/Sidebar.vue'
</script>
<style scoped>
html, body {
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background: linear-gradient(120deg, #ffe6b3 0%, #b3e6ff 100%);
  overflow-x: hidden;
}
.app-root {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
  box-sizing: border-box;
  background: linear-gradient(120deg, #ffe6b3 0%, #b3e6ff 100%);
}
.main-content {
  flex: 1 1 auto;
  width: 100%;
  max-width: 1600px;
  min-width: 0;
  min-height: 0;
  background: transparent;
  padding: 0 0.5rem;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>