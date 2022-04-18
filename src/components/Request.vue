<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<script setup lang="ts">
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
let url = computed(function () {
  return store.state.url;
});

let method = computed(function () {
  return store.state.method;
});

function changeUrl(event: any): void {
  store.commit("setUrl", event.target.value);
}

function changeMethod(event: any): void {
  store.commit("setMethod", event.target.value);
}
</script>

<template>
  <div class="request">
    <span>
      <select id="http-type" data-selected @change="changeMethod" :value="method">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>
      <input type="text" placeholder="Url" @input="changeUrl" :value="url" />
      <button>Send</button>
    </span>
  </div>
</template>

<style scoped>
.request {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

span {
  margin: 10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  box-shadow: rgb(0, 0, 0) 0px 3px 8px;
}

span input {
  outline: none;
  border: 2px solid #1a1a1a;
  border-left: none;
  border-right: none;
  background-color: #111;
  font-size: 18px;
  font-weight: 800;
  padding: 2px 5px 2px 5px;
  color: #ddd;
  width: 70%;
  transition: 200ms;
}

span input:hover {
  background-color: #1a1a1a;
  color: #fff;
}

span button {
  outline: none;
  border: 2px solid #1b3edd;
  background-color: #1b3edd;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  width: 10%;
  transition: 200ms;
  cursor: pointer;
  padding: 2px 5px 2px 5px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: 200ms;
}

span button:hover {
  background-color: #2951ff;
  border: 2px solid #2951ff;
}

span select {
  outline: none;
  border-right: none;
  border: 2px solid #222;
  background-color: #1a1a1a;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  width: 20%;
  transition: 200ms;
  cursor: pointer;
  padding: 1px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  transition: 200ms;
}

span select:hover {
  background-color: #222;
}
</style>
