import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Store importu
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)
const options = {
    position: POSITION.TOP_RIGHT, // Bildirimlerin konumu
    timeout: 5000,                // Kapanma süresi (ms)
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
};

app.use(router)


app.use(store) // Store'u uygulamaya ekleyin
app.use(Toast, options);

app.mount('#app')