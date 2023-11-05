import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { vuetify } from '@/plugins/vuetify';
import { i18n } from '@/plugins/i18n';

const pinia = createPinia();

createApp(App).use(pinia).use(router).use(vuetify).use(i18n).mount('#app');
