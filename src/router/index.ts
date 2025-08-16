import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Product from '../components/Product.vue'
import Boletas from '../components/Boletas.vue'
import Ventas from '../components/Ventas.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/product', name: 'product', component: Product },
  { path: '/boletas', name: 'boleta', component: Boletas },
  { path: '/ventas', name: 'venta', component: Ventas }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router