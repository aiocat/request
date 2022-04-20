<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="header" v-for="(data, index) in responseHeaders">
    <div>
      <input type="text" :value="data[0]" disabled />
      <input type="text" :value="data[1]" disabled />
    </div>
    <button @click="copyHeader(data)">Copy</button>
  </div>
</template>

<script setup lang="ts">
import { writeText } from "@tauri-apps/api/clipboard";
import { StoreManager } from "../helpers/storeManager";
import { Totify } from "../notify/index";

const store = new StoreManager();
let responseHeaders = store.getState("responseHeaders");

function copyHeader(data: Array<string>): void {
  Totify.info("Header copied to clipboard");
  writeText(`${data[0]}: ${data[1]}`);
}
</script>

<style scoped>
.header {
  width: 90%;
  margin: 0px auto;
}

button {
  outline: none;
  border: none;
  color: #ddd;
  background: #0a0a0a;
  border: 2px solid #111;
  padding: 2px 6px 2px 6px;
  font-size: 18px;
  font-weight: 700;
  transition: 200ms;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  color: #fff;
  background: #111;
  border: 2px solid #1a1a1a;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0a0a0a;
  border: 2px solid #111;
  margin: 5px auto;
  padding: 5px;
  border-radius: 5px;
  box-sizing: border-box;
}

.header input {
  outline: none;
  border: 2px solid #1a1a1a;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 700;
  background: #111;
  margin-right: 4px;
  color: #ddd;
  padding: 2px 6px 2px 6px;
  transition: 200ms;
}

.header input:hover {
  background: #1a1a1a;
  color: #fff;
}
.header input:hover {
  background: #1a1a1a;
  color: #fff;
}
</style>
