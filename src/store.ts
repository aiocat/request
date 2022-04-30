// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createStore } from "vuex";

export default createStore({
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
      responseHeaders: [],

      requestState: 0,
      mainState: 0,

      generatedCode: "",

      i18n: {},
      i18nLanguage: "en",
      i18nTranslations: {},

      loading: false,
    };
  },
  mutations: {
    setLoading: (state: any, param: boolean) => (state.loading = param),
    setL10N: (state: any, param: string) => (state.i18n = JSON.parse(param)),
    setL10NLang: (state: any, param: string) => (state.i18nLanguage = param),
    setL10NTranslations: (state: any, param: string) =>
      (state.i18nTranslations = JSON.parse(param)),
    setRequestState: (state: any, param: number) =>
      (state.requestState = param),
    setMainState: (state: any, param: number) => (state.mainState = param),
    setResponseBody: (state: any, param: string) =>
      (state.responseBody = param),
    setGeneratedCode: (state: any, param: string) =>
      (state.generatedCode = param),
    setResponseStatus: (state: any, param: number) =>
      (state.responseStatus = param),
    setResponsePerformance: (state: any, param: number) =>
      (state.responsePerformance = param),
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
    setResponseHeaders(state: any, headers: Record<string, any>) {
      state.responseHeaders = [];
      for (let key in headers) {
        state.responseHeaders.push([key, headers[key]]);
      }
    },
  },
});
