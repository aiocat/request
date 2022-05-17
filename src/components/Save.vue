<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="save" v-if="valid">
    <div class="flex">
      <h1 v-if="!edit">{{ data.name }}</h1>
      <input type="text" v-if="edit" v-model="editedName" maxlength="12" />
      <div class="flex">
        <img
          src="/pen-to-square-solid.svg"
          alt="edit"
          v-if="!edit"
          @click="editName(data)"
        />
        <img
          src="/check-solid.svg"
          alt="save-edit"
          v-if="edit"
          @click="saveEdit(data)"
        />
        <h2>{{ data.method }}</h2>
      </div>
    </div>
    <div class="flex-center">
      <button @click="loadSave(data)">{{ i18n.saves.load_button }}</button>
      <button @click="copyUrl(data)">{{ i18n.saves.copy_button }}</button>
      <button @click="removeSave(data)">{{ i18n.saves.remove_button }}</button>
    </div>
    <div v-if="edit">
      <hr />
      <input type="text" placeholder="Create new Folder" v-model="folder" />
      <p>or select a folder.</p>
      <div class="folders">
        <button v-for="f in folders" @click="folder = f">{{ f }}</button>
      </div>
      <p>({{ folder }})</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { writeText } from "@tauri-apps/api/clipboard";
import { Totify } from "../notify/index";
import { invoke } from "@tauri-apps/api";
import { StoreManager } from "../helpers/storeManager";
import { ref } from "vue";

defineProps<{
  data: Record<string, any>;
}>();

let valid = ref<boolean>(true);
let edit = ref<boolean>(false);
let editedName = ref<string>("");
let folder = ref<string>("");

let store = new StoreManager();
let folders = store.getState("folders");
let i18n = store.getState("i18n");

function loadSave(data: Record<string, any>): void {
  store.store.commit("setUrl", data.url);
  store.store.commit("setMethod", data.method);
  store.store.commit("setBody", data.body);
  store.store.commit("setBodyType", data.bodyType);
  store.store.commit("setHeaders", data.headers);

  if (!data.queryParameters) data.queryParameters = {};
  store.store.commit("setQueryParameters", data.queryParameters);
  store.store.commit("setMainState", 1);
  store.store.commit("setRequestState", 0);
}

function removeSave(data: Record<string, any>): void {
  invoke("remove_from_json_file", { save: data });
  valid.value = false;
}

function copyUrl(data: Record<string, any>): void {
  writeText(data.url);
  Totify.info("URL copied to clipboard");
}

function editName(data: Record<string, any>): void {
  editedName.value = data.name;
  edit.value = true;
}

async function saveEdit(data: Record<string, any>): Promise<void> {
  if (data.name === editedName.value && folder.value === "") {
    edit.value = false;
    return;
  }

  let result = await invoke("edit_save", {
    old: data.name,
    new: editedName.value,
    folder: folder.value,
  });

  if (!result) {
    Totify.error("This name already exists");
    edit.value = false;
    window.location.reload();

    return;
  }

  edit.value = false;
  folder.value = "";
  data.name = editedName.value;
  window.location.reload();
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
  flex-wrap: wrap;
  margin: 5px;
}

.save .flex h1 {
  color: #fff;
  font-size: 24px;
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
  transition: 200ms;
  margin: 0px;
}

.save .flex img {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 5px;
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(255deg)
    brightness(108%) contrast(101%);
  opacity: 0.7;
  cursor: pointer;
  transition: 200ms;
}

input {
  outline: none;
  border: 2px solid #222;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 700;
  background: transparent;
  color: #ddd;
  padding: 2px 6px 2px 6px;
  transition: 200ms;
  width: 50%;
}

input:hover {
  border: 2px solid #2a2a2a;
  color: #fff;
}

.save .flex img:hover {
  opacity: 1;
}

.save .flex-center button {
  outline: none;
  padding: 4px 10px 4px 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  margin: 2px;
  background-color: #222;
  cursor: pointer;
  transition: 200ms;
  border: none;
  border-radius: 5px;
}

.save .flex-center button:first-child {
  background-color: #1b3edd;
}
.save .flex-center button:last-child {
  background-color: #dd1b1b;
}

.save .flex-center button:hover {
  background-color: #333;
}

.save .flex-center button:first-child:hover {
  background-color: #5b79ff;
}
.save .flex-center button:last-child:hover {
  background-color: #ff5252;
}

p {
  margin: 5px;
  color: #ddd;
  font-size: 14px;
  font-size: 600;
  word-break: break-all;
}

hr {
  margin: 5px;
  border: 2px solid #2a2a2a;
  border-radius: 10px;
}

.folders {
  max-height: 200px;
  width: 50%;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: auto;
}

.folders button {
  display: block;
  width: 100%;
  outline: none;
  border: none;
  background: #222;
  color: #fff;
  border-radius: 5px;
  margin: 5px auto;
  font-size: 16px;
  font-weight: 600;
  transition: 200ms;
  cursor: pointer;
}

.folders button:hover {
  background: #2a2a2a;
}
</style>
