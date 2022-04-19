import { createApp } from "vue";
import { createStore } from "vuex";
import App from "./App.vue";

const store = createStore({
  state() {
    return {
      url: "",
      method: "POST",
      bodyType: "None",
      body: "",
      queryParameters: [],
      headers: [],

      responseBody: "",
      responseStatus: 0,
      responsePerformance: 0,
    };
  },
  mutations: {
    setResponseBody: (state: any, param: string) => (state.responseBody = param),
    setResponseStatus: (state: any, param: number) => (state.responseStatus = param),
    setResponsePerformance: (state: any, param: number) => (state.responsePerformance = param),
    setUrl: (state: any, param: string) => (state.url = param),
    setMethod: (state: any, param: string) => (state.method = param),
    setBodyType: (state: any, param: string) => (state.bodyType = param),
    setBody: (state: any, param: string) => (state.body = param),
    newQueryParameter: (state: any) => state.queryParameters.push(["", ""]),
    editQueryParameterKey: (state: any, { index, key }) =>
      (state.queryParameters[index][0] = key),
    editQueryParameterValue: (state: any, { index, value }) =>
      (state.queryParameters[index][1] = value),
    deleteQueryParameter: (state: any, index: number) =>
      (state.queryParameters = state.queryParameters.filter(
        (_: Array<string>, i: number) => i !== index
      )),
    newHeader: (state: any) => state.headers.push(["", ""]),
    editHeaderKey: (state: any, { index, key }) =>
      (state.headers[index][0] = key),
    editHeaderValue: (state: any, { index, value }) =>
      (state.headers[index][1] = value),
    deleteHeader: (state: any, index: number) =>
      (state.headers = state.headers.filter(
        (_: Array<string>, i: number) => i !== index
      )),
    setHeaders(state: any, header: Record<string, any>) {
      state.headers = [];
      for (let key in header) {
        state.headers.push([key, header[key]]);
      }
    },
    setQueryParameters(state: any, queryParameters: Record<string, any>) {
      state.queryParameters = [];
      for (let key in queryParameters) {
        state.queryParameters.push([key, queryParameters[key]]);
      }
    },
  },
});

const app = createApp(App);
app.use(store);
app.mount("#app");
