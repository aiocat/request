<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="settings">
    <span>
      <p>{{ i18n.settings.change_language }}</p>
      <select data-selected @change="changeLanguage" :value="i18nLanguage">
        <option value="en">English</option>
        <option value="tr">Türkçe</option>
      </select>
    </span>
  </div>
</template>

<script setup lang="ts">
import { StoreManager } from "../helpers/storeManager";
import { invoke } from "@tauri-apps/api";

let store = new StoreManager();
let i18n = store.getState("i18n");
let i18nLanguage = store.getState("i18nLanguage");

async function changeLanguage(event: any) {
  event.target.disabled = true;
  store.store.commit("setL10NLang", event.target.value);

  await invoke("write_i18n", {
    language: i18nLanguage.value,
  });
  let response = await invoke("fetch_i18n");

  store.store.commit("setL10N", response);
  event.target.disabled = false;
}
</script>

<style scoped>
.settings {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
}

span {
  width: 100%;
  box-sizing: border-box;
  margin: 5px auto;
  background-color: #0a0a0a;
  border: 2px solid #111;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

p {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin: 0px;
}

select {
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
  margin: 0px;
}

select:hover,
select:focus {
  color: #fff;
  background: #111;
  border: 2px solid #1a1a1a;
}
</style>
