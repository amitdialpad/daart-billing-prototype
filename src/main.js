import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

// Note: Using custom CSS instead of Dialtone package CSS due to Vue 2/3 compatibility
// Our components have built-in styles

const app = createApp(App)
app.use(router)
app.mount('#app')
