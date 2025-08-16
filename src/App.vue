<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<style scoped>
.app-container {
  display: flex;
  /* background: linear-gradient(90deg, rgb(123 181 157) 0%, 
                                     rgb(123 181 157) 50%,
                                     rgb(123 181 157) 100%); */
  background: linear-gradient(90deg, rgb(249 206 190) 0%, rgb(249 224 198) 50%, rgb(209 225 250) 100%);
}
.main-content {
  flex: 1;
  padding: 2rem;
}
</style>