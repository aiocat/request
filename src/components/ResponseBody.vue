<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <span>
    <p>
      Status: <strong>{{ responseStatus }}</strong>
    </p>
    <p>
      Size: <strong>{{ responseSize }}B</strong>
    </p>
    <p>
      Time: <strong>{{ responsePerformance }}ms</strong>
    </p>
  </span>
  <span>
    <button>Copy</button>
    <button>Clear</button>
  </span>
  <div id="response"></div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import { computed, onMounted } from "vue";

import ace from "ace-builds";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

const store = useStore();
let responseBody = computed(function () {
  return store.state.responseBody;
});

let responseType = computed(function () {
  return store.state.responseType;
});

let responseStatus = computed(function () {
  return store.state.responseStatus;
});

let responsePerformance = computed(function () {
  return store.state.responsePerformance;
});

function changeBodyType(event: any): void {
  store.commit("setBodyType", event.target.value);
}

let aceBody: ace.Ace.Editor;
let responseSize = new TextEncoder().encode(responseBody.value).length;

onMounted(() => {
  aceBody = ace.edit("response");
  aceBody.setShowPrintMargin(false);
  aceBody.setReadOnly(true);
  aceBody.setFontSize("12pt");
  aceBody.setTheme("ace/theme/tomorrow_night_eighties");

  switch (responseType.value) {
    case 0:
      aceBody.getSession().setMode("ace/mode/plain_text");
      break;
    case 1:
      aceBody.getSession().setMode("ace/mode/json");
      break;
  }

  aceBody.setValue(responseBody.value);
});
</script>

<style scoped>
div,
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

p {
  color: #ddd;
  font-size: 18px;
  font-weight: 600;
  margin: 0px;
}

p strong {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  margin: 0px;
}

select {
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
}

select:hover,
select:focus {
  color: #fff;
  background: #111;
  border: 2px solid #1a1a1a;
}

.ace_editor {
  height: 70vh;
}
</style>
