import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Store importu

const app = createApp(App)

app.use(router)
app.use(store) // Store'u uygulamaya ekleyin

app.mount('#app')