<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="request">
    <span>
      <select
        data-selected
        @change="(e: any) => store.store.commit('setMethod', e.target.value)"
        :value="method"
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>
      <input
        type="text"
        placeholder="Url"
        @input="(e: any) => store.store.commit('setUrl', e.target.value)"
        :value="url"
      />
      <button @click="sendRequest">Send</button>
      <button @click="saveRequest">Save</button>
    </span>
    <RequestNavbar />
  </div>
</template>

<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { Totify } from "../notify/index";
import { StoreManager } from "../helpers/storeManager";
import {
  generateRequestFormat,
  generateSaveFormat,
} from "../helpers/objectFormatter";

import RequestNavbar from "./RequestNavbar.vue";

let store = new StoreManager();
let url = store.getState("url");
let method = store.getState("method");
let body = store.getState("body");
let bodyType = store.getState("bodyType");
let headers = store.getState("headers");
let queryParameters = store.getState("queryParameters");

async function sendRequest(): Promise<void> {
  if (!/https?:\/\/.*?\..*/g.test(url.value)) {
    Totify.error("Invalid URL");
    return;
  }

  let beforeResponse: number = Date.now();
  let response: Record<string, any> = await invoke("send_request", {
    request: generateRequestFormat({
      url: url.value,
      method: method.value,
      body: body.value,
      bodyType: bodyType.value,
      queryParameters: queryParameters.value,
      headers: headers.value,
    }),
  });
  let responseTime: number = Date.now() - beforeResponse;

  Totify.success("Request sent successfully");

  store.store.commit("setResponseBody", response.body);
  store.store.commit("setResponseStatus", response.status);
  store.store.commit("setResponsePerformance", responseTime);
  store.store.commit("setResponseHeaders", response.headers);
  store.store.commit("setMainState", 1);
  store.store.commit("setRequestState", 1);
}

function saveRequest(): void {
  if (!/https?:\/\/.*?\..*/g.test(url.value)) {
    Totify.error("Invalid URL");
    return;
  }

  invoke("write_json_file", {
    save: generateSaveFormat({
      url: url.value,
      method: method.value,
      body: body.value,
      bodyType: bodyType.value,
      queryParameters: queryParameters.value,
      headers: headers.value,
    }),
  });

  Totify.success("Request saved successfully");

  store.store.commit("setMainState", 0);
  store.store.commit("setRequestState", 0);
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
  width: 75%;
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
  transition: 200ms;
}

span button:hover {
  background-color: #2951ff;
  border: 2px solid #2951ff;
}

span button:last-of-type {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 2px solid #12a354;
  background-color: #12a354;
}

span button:last-of-type:hover {
  border: 2px solid #1cc467;
  background-color: #1cc467;
}

span select {
  outline: none;
  border-right: none;
  border: 2px solid #222;
  background-color: #1a1a1a;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  width: 15%;
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
