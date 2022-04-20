<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <span>
    <p>Edit Mode</p>
    <select
      data-selected
      @change="(e: any) => store.store.commit('setBodyType', e.target.value)"
      :value="bodyType"
    >
      <option value="None">None</option>
      <option value="Json">JSON</option>
      <option value="Text">Text</option>
      <option value="Bytes">Bytes</option>
    </select>
  </span>
  <div id="body-editor"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { StoreManager } from "../helpers/storeManager";

import ace from "ace-builds";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

const store = new StoreManager();
let body = store.getState("body");
let bodyType = store.getState("bodyType");

onMounted(() => {
  let aceBody: ace.Ace.Editor = ace.edit("body-editor");
  aceBody.setShowPrintMargin(false);
  aceBody.setFontSize("12pt");
  aceBody.setTheme("ace/theme/tomorrow_night_eighties");
  aceBody.getSession().setMode("ace/mode/json");
  aceBody.addEventListener("input", () =>
    store.store.commit("setBody", aceBody.getValue())
  );
  aceBody.setValue(body.value);
});
</script>

<style scoped>
div,
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
}

select:hover,
select:focus {
  color: #fff;
  background: #111;
  border: 2px solid #1a1a1a;
}

.ace_editor {
  height: 70vh;
}
</style>
