import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state() {
        return {
            url: "",
            method: "POST"
        }
    },
    mutations: {
        setUrl(state: any, url: string) {
            state.url = url
        },
        setMethod(state: any, method: string) {
            state.method = method
        }
    }
})

const app = createApp(App)
app.use(store)
app.mount('#app')
