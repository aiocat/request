<!--
 Copyright (C) 2022 aiocat
 
 This file is part of request.
 
 request is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 request is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with request.  If not, see <http://www.gnu.org/licenses/>.
-->

<template>
  <div class="folders">
    <h1>{{ i18n.saves.folders.title }}</h1>
    <hr />
    <SaveFolder v-for="f in folders" :folder="f" />
  </div>
</template>

<script setup lang="ts">
import { StoreManager } from "../helpers/storeManager";
import SaveFolder from "./SaveFolder.vue";

let store = new StoreManager();
let folders = store.getState("folders");
let i18n = store.getState("i18n");
store.store.commit("setFolders");
</script>

<style scoped>
.folders {
  width: 300px;
  height: 100%;
  background: #0a0a0a;
  border-right: 2px solid #111;
  text-align: center;
  box-sizing: border-box;
  overflow: auto;
}

h1 {
  color: #ddd;
  margin: 0;
  margin-top: 5px;
  font-size: 24px;
  font-weight: 600;
}

hr {
  border: 2px solid #111;
  border-radius: 5px;
  width: 80%;
  margin: 5px auto;
}

button {
  outline: none;
  padding: 4px 10px 4px 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  margin: 2px;
  background: #12a354;
  cursor: pointer;
  transition: 200ms;
  border: none;
  border-radius: 5px;
}

button:hover {
  background: #1cc467;
}

.list {
  box-sizing: border-box;
  width: 100%;
}
</style>
