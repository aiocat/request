<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <span>
    <p>
      {{ i18n.response.body.status_text }}:
      <strong>{{ responseStatus }}</strong>
    </p>
    <p>
      {{ i18n.response.body.size_text }}:
      <strong>{{ byteFormatter(responseSize) }}</strong>
    </p>
    <p>
      {{ i18n.response.body.time_text }}:
      <strong>{{ responsePerformance }}ms</strong>
    </p>
  </span>
  <span>
    <button @click="copyContent">{{ i18n.response.body.copy_button }}</button>
    <button @click="clearContent">{{ i18n.response.body.clear_button }}</button>
  </span>
  <div id="response"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { writeText } from "@tauri-apps/api/clipboard";
import { StoreManager } from "../helpers/storeManager";
import { Totify } from "../notify/index";
import { byteFormatter } from "../helpers/objectFormatter";

import ace from "ace-builds";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

const store = new StoreManager();
let i18n = store.getState("i18n");
let responseBody = store.getState("responseBody");
let responseStatus = store.getState("responseStatus");
let responsePerformance = store.getState("responsePerformance");
let responseHeaders = store.getState("responseHeaders");

function toRecord(response: Array<Array<string>>): Record<string, string> {
  let newRecord: Record<string, string> = {};

  for (let data of response) {
    newRecord[data[0]] = data[1];
  }

  return newRecord;
}

let aceBody: ace.Ace.Editor;
let responseSize = new TextEncoder().encode(responseBody.value).length;

function clearContent(): void {
  aceBody.setValue("");
}

function copyContent(): void {
  writeText(aceBody.getValue());
  Totify.info("Body copied to clipboard");
}

onMounted(() => {
  aceBody = ace.edit("response");
  aceBody.setShowPrintMargin(false);
  aceBody.setReadOnly(true);
  aceBody.setFontSize("12pt");
  aceBody.setTheme("ace/theme/tomorrow_night_eighties");

  let contentType: string =
    toRecord(responseHeaders.value)["content-type"] || "";

  if (contentType.includes("json")) {
    aceBody.getSession().setMode("ace/mode/json");
    aceBody.setValue(JSON.stringify(JSON.parse(responseBody.value), null, 2));
    return;
  } else if (contentType.includes("html")) {
    aceBody.getSession().setMode("ace/mode/html");
  } else if (contentType.includes("css")) {
    aceBody.getSession().setMode("ace/mode/css");
  } else if (contentType.includes("javascript")) {
    aceBody.getSession().setMode("ace/mode/javascript");
  } else if (contentType.includes("xml") || contentType.includes("svg")) {
    aceBody.getSession().setMode("ace/mode/xml");
  } else {
    aceBody.getSession().setMode("ace/mode/plain_text");
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
