import { createApp } from 'vue'
import './style.css'
import router from './router'
import App from './App.vue'
import naive from './components'

const app = createApp(App)
app.use(router)
app.use(naive)
app.mount('#app')
