<!--
 Copyright (c) 2022 aiocat
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<template>
  <div class="code-generation">
    <span>
      <p>Select Language</p>
      <select data-selected @change="generateCode" v-model="selectedLang">
        <option value="JavaScript (fetch)">JavaScript (fetch)</option>
        <option value="Python (requests)">Python (requests)</option>
      </select>
    </span>
    <div id="generated-code"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { Totify } from "../notify/index";

import ace from "ace-builds";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";

let selectedLang = ref<string>("JavaScript (fetch)");

const store = useStore();
let url = computed(function () {
  return store.state.url;
});

let method = computed(function () {
  return store.state.method;
});

let body = computed(function () {
  return store.state.body;
});

let bodyType = computed(function () {
  return store.state.bodyType;
});

let headers = computed(function () {
  return store.state.headers;
});

let queryParameters = computed(function () {
  return store.state.queryParameters;
});

function generateCode() {
  switch (selectedLang.value) {
    case "JavaScript (fetch)":
      aceBody.setValue(generateJavaScriptFetch());
      aceBody.getSession().setMode("ace/mode/javascript");
      break;
    case "Python (requests)":
      aceBody.setValue(generatePythonRequests());
      aceBody.getSession().setMode("ace/mode/python");
      break;
  }
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

function generateQueryParameterTail(): string {
  let queryTail: string = "?";

  for (let data of queryParameters.value) {
    queryTail += `${data[0]}=${data[1]}&`;
  }

  queryTail = queryTail.slice(0, -1);
  return queryTail;
}

// code generator starts here:
// javascript (fetch api) code generator
function generateJavaScriptFetch(): string {
  let bodyTypeIsNone: boolean = bodyType.value === "None";
  let newUrl = url.value;

  // add query parameter (if exists)
  newUrl += generateQueryParameterTail();

  let code: string = `let response = await fetch("${newUrl}", {\n  method: "${method.value}",\n`;

  // check method
  if (
    (method.value === "POST" ||
      method.value === "PUT" ||
      method.value === "PATCH") &&
    !bodyTypeIsNone
  ) {
    if (bodyType.value === "Json") {
      try {
        JSON.parse(body.value);
      } catch {
        Totify.error("Invalid JSON Format");
        return "";
      }

      code += `  body: JSON.stringify(${body.value}),\n`;
    } else {
      // escape `
      code += `  body: \`${body.value.replaceAll("`", "\\`")}\`,\n`;
    }
  }

  // check header exists
  if (headers.value.length > 0) {
    let newHeaders: Record<string, string> = {};

    for (let data of headers.value) {
      newHeaders[data[0]] = data[1];
    }

    code += `  headers: ${JSON.stringify(newHeaders, null, 4).slice(
      0,
      -1
    )}  }\n`;
  }

  code += "});";
  return code;
}

// python (requests) code generator
function generatePythonRequests(): string {
  let bodyTypeIsNone: boolean = bodyType.value === "None";
  let newUrl = url.value;

  // add query parameter (if exists)
  newUrl += generateQueryParameterTail();

  let code: string = `import requests, json\n\nresponse = requests.${method.value.toLowerCase()}(\n  "${newUrl}",\n`;

  // check methods
  if (
    (method.value === "POST" ||
      method.value === "PUT" ||
      method.value === "PATCH") &&
    !bodyTypeIsNone
  ) {
    if (bodyType.value === "Json") {
      try {
        JSON.parse(body.value);
      } catch {
        Totify.error("Invalid JSON Format");
        return "";
      }

      // escape quote
      code += `  json = json.loads("""${body.value.replaceAll(
        '"',
        '\\"'
      )}"""),\n`;
    } else {
      // escape quote
      code += `  data = """${body.value.replaceAll('"', '\\"')}""",\n`;
    }
  }

  // check header exists
  if (headers.value.length > 0) {
    let newHeaders: Record<string, string> = {};

    for (let data of headers.value) {
      newHeaders[data[0]] = data[1];
    }

    let headerStr: string = JSON.stringify(newHeaders);
    headerStr = headerStr.replaceAll('"', '\\"');

    code += `  headers = json.loads("""${headerStr}""")\n`;
  }

  code += ")";
  return code;
}
</script>

<style scoped>
.code-generation {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
}

span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  padding: 5px;
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
}
</style>
