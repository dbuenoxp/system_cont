<template>
    <div :class="['sidebar', { collapsed }]">
      <div class="top-section">
        <div class="logo">IP</div>
        <button @click="toggleCollapse">{{ collapsed ? '>>' : '<<' }}</button>
      </div>
      <ul class="menu">
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.route">
            <span class="icon">{{ item.icon }}</span>
            <span v-if="!collapsed" class="text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
      <div class="settings">
        <router-link to="/settings">
          <span class="icon">⚙️</span>
          <span v-if="!collapsed" class="text">Settings</span>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const collapsed = ref(false)
  const toggleCollapse = () => collapsed.value = !collapsed.value
  
  const menuItems = [
    { name: 'Home', icon: '🏠', route: '/' },
    { name: 'Administrar', icon: '⏱️', route: '/about' },
    { name: 'Productos', icon: '🥪', route: '/product' },
    { name: 'Contabilidad', icon: '✉️', route: '/boletas' },
    { name: 'Venta Productos', icon: '✉️', route: '/ventas' }
  ]
  </script>
  
  <style scoped>
  .sidebar {
    background: #1f2937;
    color: #fff;
    min-height: 100vh;
    width: 220px;
    transition: width 0.3s ease;
    overflow: hidden;
  }
  .sidebar.collapsed {
    width: 60px;
  }
  .top-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
  }
  .logo {
    font-size: 1.5rem;
  }
  .menu {
    list-style: none;
    padding: 0;
  }
  .menu li {
    padding: 1rem;
  }
  .menu li .icon {
    margin-right: 0.5rem;
  }
  .settings {
    position: absolute;
    bottom: 1rem;
    width: 100%;
    padding: 1rem;
  }

  a{
    color: #e0e0e3;
  }
  </style>