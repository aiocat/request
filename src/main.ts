import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state() {
        return {
            url: "",
            method: "POST",
            bodyType: "None",
            body: "",
            queryParameters: []
        }
    },
    mutations: {
        setUrl: (state: any, param: string) => state.url = param,
        setMethod: (state: any, param: string) => state.method = param,
        setBodyType: (state: any, param: string) => state.bodyType = param,
        setBody: (state: any, param: string) => state.body = param,
        newQueryParameter: (state: any) => state.queryParameters.push(["", ""]),
        editQueryParameterKey: (state: any, { index, key }) => state.queryParameters[index][0] = key,
        editQueryParameterValue: (state: any, { index, value }) => state.queryParameters[index][1] = value,
        deleteQueryParameter: (state: any, index: number) => state.queryParameters = state.queryParameters.filter((_, i) => i !== index)
    }
})

const app = createApp(App)
app.use(store)
app.mount('#app')
