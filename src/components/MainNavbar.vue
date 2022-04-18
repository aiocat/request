<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<script setup lang="ts">

</script>

<template>
  <div>
    <img src="/floppy-disk-solid.svg" alt="save">
    <img src="/arrow-right-arrow-left-solid.svg" alt="request">
  </div>
</template>

<style scoped>
div{
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
  filter: invert(9%) sepia(43%) saturate(0%) hue-rotate(227deg) brightness(98%) contrast(91%);
}

img:hover {
  filter: invert(26%) sepia(99%) saturate(4565%) hue-rotate(230deg) brightness(103%) contrast(103%);
}
</style>
