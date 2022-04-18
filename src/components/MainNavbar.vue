<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<script setup lang="ts">
import Saves from "./Saves.vue";
import { ref } from "vue";

const selected = ref(1);
</script>

<template>
  <div class="navbar">
    <img src="/floppy-disk-solid.svg" alt="save" @click="selected = 0" />
    <img
      src="/arrow-right-arrow-left-solid.svg"
      alt="request"
      @click="selected = 1"
    />
  </div>
  <Saves v-if="selected == 0" />
</template>

<style scoped>
.navbar {
  width: auto;
  height: 100%;
  background: #0a0a0a;
  border-right: 2px solid #111;
  text-align: center;
  box-sizing: border-box;
}

img {
  margin: 10px;
  display: block;
  width: 24px;
  cursor: pointer;
  filter: invert(9%) sepia(43%) saturate(0%) hue-rotate(227deg) brightness(98%)
    contrast(91%);
  transition: 200ms;
}

img:hover {
  filter: invert(26%) sepia(99%) saturate(4565%) hue-rotate(230deg)
    brightness(103%) contrast(103%);
}
</style>
