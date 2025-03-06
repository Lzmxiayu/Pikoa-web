// import './assets/main.css'
import '@/assets/style/dark.css';
import '@arco-design/web-vue/dist/arco.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Message } from '@arco-design/web-vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

Message._context = app._context;

app.use(createPinia());
app.use(router);

app.mount('#app');

document.body.setAttribute('theme', 'dark');
document.body.setAttribute('arco-theme', 'dark');
