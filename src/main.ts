import { createApp } from 'vue'
import './style.css'
import router from './router'
import App from './App.vue'
import {createDiscreteApi} from "naive-ui";
const app = createApp(App)
app.use(router)
app.mount('#app')

createDiscreteApi