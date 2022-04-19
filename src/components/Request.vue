<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="request">
    <span>
      <select data-selected @change="changeMethod" :value="method">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>
      <input type="text" placeholder="Url" @input="changeUrl" :value="url" />
      <button @click="sendRequest">Send</button>
    </span>
    <RequestNavbar />
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed } from "vue";
import RequestNavbar from "./RequestNavbar.vue";
import { invoke } from "@tauri-apps/api";

const store = useStore();
let url = computed(function () {
  return store.state.url;
});

let method = computed(function () {
  return store.state.method;
});

let body = computed(function () {
  return store.state.body;
});

let bodyType = computed(function () {
  return store.state.bodyType;
});

let headers = computed(function () {
  return store.state.headers;
});

let queryParameters = computed(function () {
  return store.state.queryParameters;
});

function changeUrl(event: any): void {
  store.commit("setUrl", event.target.value);
}

function changeMethod(event: any): void {
  store.commit("setMethod", event.target.value);
}

function setResponseBody(value: string): void {
  store.commit("setResponseBody", value);
}

function setResponseStatus(value: number): void {
  store.commit("setResponseStatus", value);
}

function setResponsePerformance(value: number): void {
  store.commit("setResponsePerformance", value);
}

function generateRequestFormat(): Record<string, Record<string, any>> {
  let newHeaders: Record<string, string> = {};
  let newQuery: Record<string, string> = {};

  for (let data of headers.value) {
    newHeaders[data[0]] = data[1];
  }

  for (let data of queryParameters.value) {
    newQuery[data[0]] = data[1];
  }

  console.log(newHeaders);

  return {
    request: {
      body: body.value,
      bodyType: bodyType.value,
      headers: newHeaders,
      queryParameters: newQuery,
      url: url.value,
      method: method.value,
    },
  };
}

async function sendRequest(): Promise<void> {
  let beforeResponse: number = Date.now();
  let response: Record<string, any> = await invoke(
    "send_request",
    generateRequestFormat()
  );
  let responseTime: number = Date.now() - beforeResponse;

  setResponseBody(response.body);
  setResponseStatus(response.status);
  setResponsePerformance(responseTime);
}
</script>

<style scoped>
.request {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
}

span {
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  box-shadow: rgb(0, 0, 0) 0px 3px 8px;
}

span input {
  outline: none;
  border: 2px solid #1a1a1a;
  border-left: none;
  border-right: none;
  background-color: #111;
  font-size: 18px;
  font-weight: 800;
  padding: 2px 5px 2px 5px;
  color: #ddd;
  width: 70%;
  transition: 200ms;
}

span input:hover {
  background-color: #1a1a1a;
  color: #fff;
}

span button {
  outline: none;
  border: 2px solid #1b3edd;
  background-color: #1b3edd;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  width: 10%;
  transition: 200ms;
  cursor: pointer;
  padding: 2px 5px 2px 5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  transition: 200ms;
}

span button:hover {
  background-color: #2951ff;
  border: 2px solid #2951ff;
}

span select {
  outline: none;
  border-right: none;
  border: 2px solid #222;
  background-color: #1a1a1a;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  width: 20%;
  transition: 200ms;
  cursor: pointer;
  padding: 1px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  transition: 200ms;
}

span select:hover {
  background-color: #222;
}
</style>
