<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="navbar">
    <img
      src="/arrow-right-solid.svg"
      alt="send-request"
      @click="selected = 0"
    />
    <img src="/arrow-left-solid.svg" alt="response" @click="selected = 1" />
    <img src="/code-solid.svg" alt="code" @click="selected = 2" />
  </div>
  <Request v-if="selected === 0" />
  <Response v-else-if="selected === 1" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import Request from "./Request.vue";
import Response from "./Response.vue";

const selected = ref(0);
</script>

<style scoped>
.navbar {
  width: auto;
  height: 100%;
  border-right: 2px solid #111;
  text-align: center;
  box-sizing: border-box;
}

img {
  padding: 10px;
  display: block;
  width: 24px;
  height: 24px;
  cursor: pointer;
  filter: invert(9%) sepia(43%) saturate(0%) hue-rotate(227deg) brightness(98%)
    contrast(91%);
  transition: 200ms;
  border-left: 2px solid transparent;
}

img:hover {
  filter: invert(26%) sepia(99%) saturate(4565%) hue-rotate(230deg)
    brightness(103%) contrast(103%);
  border-left: 2px solid #2951ff;
}
</style>
