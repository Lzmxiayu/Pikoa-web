// import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Message } from '@arco-design/web-vue';

import App from './App.vue';
import router from './router';
// import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css';

const app = createApp(App);

Message._context = app._context;

app.use(createPinia());
// .use(ArcoVueIcon)
app.use(router);

app.mount('#app');
