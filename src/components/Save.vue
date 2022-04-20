<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="save" v-if="valid">
    <div class="flex">
      <h1>{{ data.name }}</h1>
      <h2>{{ data.method }}</h2>
    </div>
    <div class="flex-center">
      <button @click="loadSave(data)">Load</button>
      <button @click="copyUrl(data)">Copy Url</button>
      <button @click="removeSave(data)">Remove</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { writeText } from "@tauri-apps/api/clipboard";
import { Totify } from "../notify/index";
import { invoke } from "@tauri-apps/api";
import { useStore } from "vuex";
import { ref } from "vue";

defineProps<{
  data: Record<string, any>;
}>();

let valid = ref<boolean>(true);
const store = useStore();

function loadSave(data: Record<string, any>): void {
  store.commit("setUrl", data.url);
  store.commit("setMethod", data.method);
  store.commit("setBody", data.body);
  store.commit("setBodyType", data.bodyType);
  store.commit("setHeaders", data.headers);

  if (!data.queryParameters) data.queryParameters = {};
  store.commit("setQueryParameters", data.queryParameters);
  store.commit("setMainState", 1);
  store.commit("setRequestState", 0);
}

function removeSave(data: Record<string, any>): void {
  invoke("remove_from_json_file", { save: data });
  valid.value = false;
}

function copyUrl(data: Record<string, any>): void {
  writeText(data.url);
  Totify.info("URL copied to clipboard");
}
</script>

<style scoped>
.save {
  background: #111;
  border: 2px solid #1a1a1a;
  flex: 1 1 25%;
  margin: 10px;
  border-radius: 5px;
  padding: 5px 10px 5px 10px;
  box-shadow: rgb(0, 0, 0) 0px 3px 8px;
  transition: 200ms;
}

.save:hover {
  background: #1a1a1a;
}
.save:hover > .flex h2 {
  background: #111;
}

.save .flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px;
}

.save .flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
}

.save .flex h1 {
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  margin: 0px;
}

.save .flex h2 {
  background: #0a0a0a;
  border-radius: 10px;
  padding: 2px 5px 2px 5px;
  color: #1b3edd;
  font-size: 14px;
  font-weight: 800;
  margin: 0px;
  transition: 200ms;
}

.save .flex-center button {
  outline: none;
  padding: 4px 10px 4px 10px;
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 700;
  margin: 0px;
  background-color: #222;
  cursor: pointer;
  transition: 200ms;
}

.save .flex-center button:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #1b3edd;
}
.save .flex-center button:last-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #dd1b1b;
}

.save .flex-center button:hover {
  filter: brightness(70%);
}
</style>
