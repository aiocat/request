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

#TOTIFY_NOTIFICATIONS div {
  font-size: 18px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  color: #000;
   animation: slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

#TOTIFY_NOTIFICATIONS div::after {
  display: block;
  content: "(click to destroy)";
  font-size: 12px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  color: #0a0a0a;
}

@keyframes slide-left {
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}
</style>
