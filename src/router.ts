import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from "./components/Home.vue";
import EspConfig from './components/esp/EspConfig.vue'
const routes: RouteRecordRaw[] = [
    {
        path: '/', component: Home, meta: {
            title: '首页'
        }
    },
    {
        path: '/player', component: () => import("./components/video/VideoHome.vue"), meta: {
            title: '播放器'
        }
    },
    {
        path: '/config',component: EspConfig, meta: {
            title: '配置'
        }
    }
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
export default router