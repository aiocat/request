<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <MainSidebar />
</template>

<script setup lang="ts">
import MainSidebar from "./components/MainSidebar.vue";
</script>

<style>
html,
body,
#app {
  margin: 0 auto;
  font-family: "Nunito", sans-serif;
  background-color: #030303;
  box-sizing: border-box;
  scroll-behavior: smooth;
  width: 100%;
  height: 100%;
  display: flex;
}

input,
button,
select {
  font-family: "Nunito", sans-serif;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #111;
  border-radius: 100px;
}
::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 100px;
}
::-webkit-scrollbar-track:hover {
  background: transparent;
}
::-webkit-scrollbar-track:active {
  background: transparent;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
