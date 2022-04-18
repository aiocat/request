<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="save">
    <div class="flex">
      <h1>{{ data.name }}</h1>
      <h2>{{ data.method }}</h2>
    </div>
    <div class="flex-center">
      <button>Load</button>
      <button @click="writeText(data.url)">Copy Url</button>
      <button>Remove</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { writeText } from "@tauri-apps/api/clipboard";

defineProps<{
  data: Record<string, any>;
}>();
</script>

<style scoped>
.save {
  background: #111;
  border: 2px solid #1a1a1a;
  flex: 1 1 25%;
  margin: 10px;
  border-radius: 10px;
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
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background-color: #1b3edd;
}
.save .flex-center button:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #dd1b1b;
}

.save .flex-center button:hover {
  filter: brightness(70%);
}
</style>
