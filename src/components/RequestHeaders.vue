<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <span>
    <p>Manage Headers</p>
    <button @click="addHeader">Add Header</button>
  </span>
  <div class="header" v-for="(data, index) in headers">
    <div>
      <input
        type="text"
        :value="data[0]"
        @input="(e: any) => updateHeaderKey(index, e.target.value)"
        placeholder="Key"
      />
      <input
        type="text"
        :value="data[1]"
        @input="(e: any) => updateHeaderValue(index, e.target.value)"
        placeholder="Value"
      />
    </div>
    <button @click="removeHeader(index)">Remove</button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
let headers = computed(function () {
  return store.state.headers;
});

const addHeader = () => store.commit("newHeader");
const updateHeaderKey = (index: number, key: string) =>
  store.commit("editHeaderKey", { index, key });
const updateHeaderValue = (index: number, value: string) =>
  store.commit("editHeaderValue", { index, value });
const removeHeader = (index: number) =>
  store.commit("deleteHeader", index);
</script>

<style scoped>
.header,
span {
  width: 90%;
  margin: 0px auto;
}

span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  padding: 5px;
}

span p {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin: 0px;
}

span button {
  outline: none;
  border: none;
  color: #ddd;
  background: #0a0a0a;
  border: 2px solid #111;
  padding: 2px 6px 2px 6px;
  font-size: 18px;
  font-weight: 700;
  transition: 200ms;
  border-radius: 5px;
  cursor: pointer;
}

span button:hover {
  color: #fff;
  background: #111;
  border: 2px solid #1a1a1a;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0a0a0a;
  border: 2px solid #111;
  margin: 5px auto;
  padding: 5px;
  border-radius: 5px;
  box-sizing: border-box;
}

.header input {
  outline: none;
  border: 2px solid #1a1a1a;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 700;
  background: #111;
  margin-right: 4px;
  color: #ddd;
  padding: 2px 6px 2px 6px;
  transition: 200ms;
}

.header input:hover {
  background: #1a1a1a;
  color: #fff;
}

.header button {
  outline: none;
  border: none;
  color: #fff;
  background: #dd1b1b;
  padding: 2px 6px 2px 6px;
  font-size: 18px;
  font-weight: 700;
  transition: 200ms;
  border-radius: 5px;
  cursor: pointer;
}

.header button:hover {
  background: #ff2d2d;
}
</style>
