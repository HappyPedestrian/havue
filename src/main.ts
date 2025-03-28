import { createApp } from 'vue'
import './style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import havue from 'havue'

const app = createApp(App)

app.use(havue)

app.mount('#app')
