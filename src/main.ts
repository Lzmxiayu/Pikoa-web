// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Slider } from 'ant-design-vue'

import App from './App.vue'
import router from './router'
// import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import mitt from 'mitt'

const app = createApp(App)

app.use(createPinia()).use(Slider)
// .use(ArcoVueIcon)
app.use(router)

app.mount('#app')
