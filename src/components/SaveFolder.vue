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
  <div v-if="valid">
    <button v-if="!edit" @click="setFolder">{{ folderName }}</button>
    <input v-else type="text" v-model="editedName" />
    <span v-if="!edit">
      <img
        src="/pen-to-square-solid.svg"
        alt="editfolder"
        @click="editFolder"
      />
      <img
        src="/delete-left-solid.svg"
        alt="removefolder"
        @click="removeFolder"
      />
    </span>
    <img v-else src="/check-solid.svg" alt="saveedit" @click="saveEdit" />
  </div>
</template>

<script setup lang="ts">
import { invoke } from "@tauri-apps/api";
import { ref } from "vue";
import { StoreManager } from "../helpers/storeManager";
import { Totify } from "../notify";

const props = defineProps<{
  folder: string;
}>();

let valid = ref<boolean>(true);
let edit = ref<boolean>(false);
let folderName = ref<string>(props.folder);
let editedName = ref<string>("");

let store = new StoreManager();

function editFolder() {
  editedName.value = folderName.value;
  edit.value = true;
}

async function saveEdit() {
  if (folderName.value == editedName.value) {
    edit.value = false;
    return;
  }
  let success = await invoke("edit_folder", {
    folder: folderName.value,
    new: editedName.value,
  });
  if (!success) {
    Totify.error("Illegal usage.");
  } else {
    folderName.value = editedName.value;
  }

  edit.value = false;
}

async function removeFolder() {
  let success = await invoke("remove_folder", { folder: folderName.value });
  if (!success) {
    Totify.error('Folder "Unknown" is a special folder and can\'t be removed.');
    return;
  }

  valid.value = false;
  store.store.commit("setCurrentFolder", "Unknown");
  Totify.info(
    'Folder removed successfully. Now you are redirected to "Unknown" folder.'
  );
}

function setFolder() {
  store.store.commit("setCurrentFolder", folderName);
}
</script>

<style scoped>
div {
  display: block;
  width: 100%;
  background: #111;
  border-bottom: 2px solid #1a1a1a;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  word-wrap: break-word;
  transition: 250ms;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
}

div:hover {
  background: #1a1a1a;
  border-bottom: 2px solid #222;
}

button,
input {
  outline: none;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  transition: 250ms;
  margin: 0;
}

button {
  cursor: pointer;
}

input {
  background: #2a2a2a;
  border: 2px solid #333;
  width: 50%;
  padding-left: 5px;
  border-radius: 5px;
}

span {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

img {
  width: 16px;
  height: 16px;
  filter: invert(97%) sepia(0%) saturate(132%) hue-rotate(159deg)
    brightness(90%) contrast(82%);
  cursor: pointer;
  margin: 0;
  margin-right: 5px;
}

img:hover {
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(159deg)
    brightness(102%) contrast(103%);
}
</style>
