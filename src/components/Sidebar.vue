<template>
  <header class="main-header">
    <div class="header-inline">
      <div class="header-logo">
        <img src="../assets/images/logo.jpeg" alt="Logo" class="sidebar-logo-img" />
      </div>
      <nav :class="['header-menu', { open: !collapsed }]">
        <ul class="menu">
          <li v-for="item in menuItems" :key="item.name">
            <router-link :to="item.route">
              <span class="icon">{{ item.icon }}</span>
              <span class="text">{{ item.name }}</span>
            </router-link>
          </li>
          <li class="settings">
            <router-link to="/settings">
              <span class="icon">⚙️</span>
              <span class="text">Settings</span>
            </router-link>
          </li>
        </ul>
      </nav>
      <button class="menu-toggle" @click="collapsed = !collapsed">
        <span v-if="collapsed">☰</span>
        <span v-else>✕</span>
      </button>
    </div>
  </header>
</template>
  
  <script setup>
  import { ref } from 'vue'
  
  const collapsed = ref(true)
  
  const menuItems = [
    { name: 'Home', icon: '🏠', route: '/' },
    { name: 'Administrar', icon: '⏱️', route: '/about' },
    { name: 'Productos', icon: '🥪', route: '/product' },
    { name: 'Contabilidad', icon: '🧾', route: '/boletas' },
    { name: 'Venta Productos', icon: '🛒', route: '/ventas' }
  ]
  </script>
  
  <style scoped>
  .main-header {
      width: 100vw;
      background: linear-gradient(120deg, #ffe6b3 0%, #b3e6ff 100%);
      color: #226488;
      box-shadow: 0 2px 16px #b3e6ff33;
      position: sticky;
      top: 0;
      left: 0;
      z-index: 9999;
      padding: 0;
    }
  .header-inline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 2rem;
    gap: 1.5rem;
  }
  .header-menu {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    transition: none;
    background: none;
    box-shadow: none;
    position: static;
    max-height: none;
    padding: 0;
    margin: 0;
  }
  .header-logo {
    display: flex;
    align-items: center;
    height: 56px;
  }
  .sidebar-logo-img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    display: block;
    margin: auto;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px #b3e6ff33;
  }
  .menu-toggle {
    display: none;
    background: #b3e6ff;
    color: #226488;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-size: 2rem;
    cursor: pointer;
    margin-left: 1rem;
    transition: background 0.2s, color 0.2s;
    align-self: center;
  }
  .menu-toggle:hover {
    background: #a3c8f7;
    color: #17405c;
  }
  .header-menu {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transition: max-height 0.3s;
  }
  .header-menu ul.menu {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .header-menu .menu li {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: background 0.2s;
  }
  .header-menu .menu li:hover {
    background: #e6f7ff;
  }
  .header-menu .menu li .icon {
    margin-right: 0.5rem;
    font-size: 1.3rem;
    vertical-align: middle;
  }
  .header-menu .settings {
    border-left: 1px solid #b3e6ff;
    margin-left: 1rem;
    padding-left: 1rem;
  }
  a {
    color: #226488;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  a.router-link-exact-active {
    background: #e6f7ff;
    border-radius: 8px;
    padding: 0.2rem 0.5rem;
    display: block;
  }
  @media (max-width: 900px) {
    .main-header {
      padding: 0;
    }
    .header-inline {
      padding: 0.5rem 1rem;
    }
    .header-menu {
      position: absolute;
      left: 0;
      top: 100%;
      width: 100vw;
      background: linear-gradient(120deg, #ffe6b3 0%, #b3e6ff 100%);
      box-shadow: 0 2px 16px #b3e6ff33;
      border-radius: 0 0 16px 16px;
      flex-direction: column;
      align-items: flex-start;
      max-height: 0;
      overflow: hidden;
      margin-top: 0.2rem;
      padding: 0;
      z-index: 200;
      transition: max-height 0.3s;
    }
    .header-menu.open {
      max-height: 500px;
      padding: 1rem 0;
    }
    .header-menu ul.menu {
      flex-direction: column;
      width: 100%;
      gap: 0.2rem;
    }
    .menu-toggle {
      display: block;
    }
  }
  </style>