import { createApp } from 'vue'
import './style.css'
import App from '../src/App.vue'
import router from './router/index.ts'
import './assets/tailwind.css'

createApp(App).use(router).mount('#app')
