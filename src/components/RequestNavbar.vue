<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->


<script setup lang="ts">
</script>

<template>
  <div class="navbar">
    <p>Body</p>
    <p>Query Parameters</p>
    <p>Headers</p>
  </div>
</template>

<style scoped>
.navbar {
  width: auto;
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