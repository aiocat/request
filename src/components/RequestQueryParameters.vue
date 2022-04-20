<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <span>
    <p>Manage Query Parameters</p>
    <button @click="addQueryParameter">Add Parameter</button>
  </span>
  <div class="query-parameter" v-for="(data, index) in queryParameters">
    <div>
      <input
        type="text"
        :value="data[0]"
        @input="(e: any) => updateQueryParameterKey(index, e.target.value)"
        placeholder="Key"
      />
      <input
        type="text"
        :value="data[1]"
        @input="(e: any) => updateQueryParameterValue(index, e.target.value)"
        placeholder="Value"
      />
    </div>
    <button @click="removeQueryParameter(index)">Remove</button>
  </div>
</template>

<script setup lang="ts">
import { StoreManager } from "../helpers/storeManager";

const store = new StoreManager();
let queryParameters = store.getState("queryParameters");

const addQueryParameter = () => store.store.commit("newQueryParameter");
const updateQueryParameterKey = (index: number, key: string) =>
  store.store.commit("editQueryParameterKey", { index, key });
const updateQueryParameterValue = (index: number, value: string) =>
  store.store.commit("editQueryParameterValue", { index, value });
const removeQueryParameter = (index: number) =>
  store.store.commit("deleteQueryParameter", index);
</script>

<style scoped>
.query-parameter,
span {
  width: 90%;
  margin: 0px auto;
}

span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  padding: 5px;
}

span p {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin: 0px;
}

span button {
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

span button:hover {
  color: #fff;
  background: #111;
  border: 2px solid #1a1a1a;
}

.query-parameter {
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

.query-parameter input {
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

.query-parameter input:hover {
  background: #1a1a1a;
  color: #fff;
}

.query-parameter button {
  outline: none;
  border: none;
  color: #fff;
  background: #dd1b1b;
  padding: 2px 6px 2px 6px;
  font-size: 18px;
  font-weight: 700;
  transition: 200ms;
  border-radius: 5px;
  cursor: pointer;
}

.query-parameter button:hover {
  background: #ff2d2d;
}
</style>
