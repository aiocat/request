<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="code-generation">
    <div class="container">
      <span>
        <p>{{ i18n.code_generator.select_text }}</p>
        <select data-selected @change="generateCode" v-model="selectedLang">
          <option value="JavaScript (fetch)">JavaScript (fetch)</option>
          <option value="Python (requests)">Python (requests)</option>
          <option value="Go (net/http)">Go (net/http)</option>
          <option value="Rust (reqwest)">Rust (reqwest)</option>
        </select>
      </span>
      <div id="generated-code"></div>
      <span>
        <button @click="copyText">{{ i18n.code_generator.copy_button }}</button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  generateJavaScriptFetch,
  generatePythonRequests,
  generateGoNetHttp,
  generateRustReqwest,
} from "../helpers/codeGenerators";
import { StoreManager } from "../helpers/storeManager";
import { Totify } from "../notify/index";
import { writeText } from "@tauri-apps/api/clipboard";

import ace from "ace-builds";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

let selectedLang = ref<string>("JavaScript (fetch)");

let store = new StoreManager();
let i18n = store.getState("i18n");

let url = store.getState("url");
let method = store.getState("method");
let body = store.getState("body");
let bodyType = store.getState("bodyType");
let queryParameters = store.getState("queryParameters");
let headers = store.getState("headers");

function generateCode() {
  let allInOne = {
    url: url.value,
    method: method.value,
    body: body.value,
    bodyType: bodyType.value,
    queryParameters: queryParameters.value,
    headers: headers.value,
  };

  if (!/https?:\/\/.*?\..*/g.test(url.value)) {
    Totify.warn("URL is invalid, your code may be broken");
  }

  switch (selectedLang.value) {
    case "JavaScript (fetch)":
      aceBody.setValue(generateJavaScriptFetch(allInOne));
      aceBody.getSession().setMode("ace/mode/javascript");
      break;
    case "Python (requests)":
      aceBody.setValue(generatePythonRequests(allInOne));
      aceBody.getSession().setMode("ace/mode/python");
      break;
    case "Go (net/http)":
      aceBody.setValue(generateGoNetHttp(allInOne));
      aceBody.getSession().setMode("ace/mode/golang");
      break;
    case "Rust (reqwest)":
      aceBody.setValue(generateRustReqwest(allInOne));
      aceBody.getSession().setMode("ace/mode/rust");
      break;
  }
}

function copyText(): void {
  writeText(aceBody.getValue());
  Totify.info("Code copied to clipboard");
}

let aceBody: ace.Ace.Editor;

onMounted(() => {
  aceBody = ace.edit("generated-code");
  aceBody.setShowPrintMargin(false);
  aceBody.setFontSize("12pt");
  aceBody.setReadOnly(true);
  aceBody.setTheme("ace/theme/tomorrow_night_eighties");
  aceBody.getSession().setMode("ace/mode/json");
  aceBody.setValue("");

  generateCode();
});
</script>

<style scoped>
.code-generation {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
}

.container {
  margin: 0px auto;
  width: 90%;
}

span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
}

p {
  color: #fff;
  font-size: 18px;
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
  margin-bottom: 5px;
  margin-top: 5px;
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
</style>
