<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="saves">
    <span>
      <input
        type="text"
        placeholder="Filter Name or Method"
        v-model="filter"
        @keyup.enter="updateFilter"
      />
      <button @click="updateFilter">Filter</button>
    </span>
    <div class="flex">
      <Save v-for="data in filtered" :data="data" />
      <Save v-for="data in filtered" :data="data" />
      <Save v-for="data in filtered" :data="data" />
      <Save v-for="data in filtered" :data="data" />
      <Save v-for="data in filtered" :data="data" />
      <Save v-for="data in filtered" :data="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api";
import Save from "./Save.vue";

const saves = ref<Record<string, any>[]>([]);
const filtered = ref<Record<string, any>[]>([]);
const filter = ref<string>("");

invoke("read_json_file").then((response: any) => {
  saves.value = response;
  filtered.value = response;
});

function updateFilter(): void {
  filtered.value = saves.value.filter(
    (v) => (v.method + v.url).indexOf(filter.value) != -1
  );
  filter.value = "";
}
</script>

<style scoped>
.saves {
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
  width: 80%;
  box-shadow: rgb(0, 0, 0) 0px 3px 8px;
}

span input {
  outline: none;
  border: 2px solid #1a1a1a;
  border-right: none;
  background-color: #111;
  font-size: 18px;
  font-weight: 800;
  padding: 2px 5px 2px 5px;
  color: #ddd;
  width: 90%;
  transition: 200ms;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
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
}

span button:hover {
  background-color: #2951ff;
  border: 2px solid #2951ff;
}

.flex {
  display: flex;
  flex: 1 1 25%;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
