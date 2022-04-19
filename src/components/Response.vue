<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="response">
    <div class="navbar">
      <p @click="selected = 0">Body</p>
      <p @click="selected = 1">Headers</p>
    </div>
    <ResponseBody v-if="selected === 0" />
    <ResponseHeaders v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ResponseBody from "./ResponseBody.vue";
import ResponseHeaders from "./ResponseHeaders.vue";

const selected = ref(0);
</script>

<style scoped>
.response {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
}
.navbar {
  width: 90%;
  border-bottom: 2px solid #1a1a1a;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  margin: 0px auto;
}

p {
  padding: 5px 10px 5px 10px;
  margin: 0px;
  display: inline;
  cursor: pointer;
  color: #222;
  font-size: 18px;
  font-weight: 700;
  transition: 200ms;
  border-bottom: 2px solid transparent;
}

p:hover {
  color: #2951ff;
  border-bottom: 2px solid #2951ff;
}
</style>
