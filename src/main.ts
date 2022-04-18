import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state() {
        return {
            url: "",
            method: "POST",
            bodyType: "None",
            body: ""
        }
    },
    mutations: {
        setUrl: (state: any, param: string) => state.url = param,
        setMethod: (state: any, param: string) => state.method = param,
        setBodyType: (state: any, param: string) => state.bodyType = param,
        setBody: (state: any, param: string) => state.body = param
    }
})

const app = createApp(App)
app.use(store)
app.mount('#app')
