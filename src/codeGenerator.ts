// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {
  getHeaders,
  getBodyContent,
  getMethod,
  getUrl,
  getBodyType,
} from "./requestDom";
import { writeText } from "@tauri-apps/api/clipboard";
import { sendNotification, sendWarn } from "./notification";
import { aceCode } from "./aceEditor";

let codeGenerateButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#run-code-generator");
let copyCode: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#copy-code");

// get selected coding language for
function getCodingLanguage(): string {
  let codeSelectElement: HTMLSelectElement | null =
    document.querySelector<HTMLSelectElement>("#code-lang");
  return codeSelectElement!.value;
}

// generate code when clicked
codeGenerateButton!.onclick = (): void => {
  codeGenerator();
};

// copy code
copyCode!.onclick = (): void => {
  writeText(aceCode.getValue());
  sendNotification("Code copied to clipboard");
};

function codeGenerator(): void {
  let language: string = getCodingLanguage();
  let url: string | null = getUrl();

  if (!url) return;

  // add your language here
  switch (language) {
    case "JavaScript (fetch)":
      aceCode.getSession().setMode("ace/mode/javascript");
      aceCode.setValue(generateJavaScriptFetch(url));
      break;
    case "Python (requests)":
      aceCode.getSession().setMode("ace/mode/python");
      aceCode.setValue(generatePythonRequests(url));
      break;
  }
}

// javascript (fetch api) code generator
function generateJavaScriptFetch(url: string): string {
  let headers: Record<string, string> = getHeaders();
  let bodyContent: string = getBodyContent();
  let method: string = getMethod();
  let bodyType: string = getBodyType();

  let code: string = `let response = await fetch("${url}", {\n  method: "${method}",\n`;

  // check method
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    if (bodyType === "Json") {
      try {
        JSON.parse(bodyContent);
      } catch {
        sendWarn("Invalid JSON Format");
        return "";
      }

      code += `  body: JSON.stringify(${bodyContent}),\n`;
    } else {
      // escape `
      code += `  body: \`${bodyContent.replaceAll("`", "\\`")}\`,\n`;
    }
  }

  // check header exists
  if (Object.keys(headers).length > 0) {
    code += `  headers: ${JSON.stringify(headers, null, 4).slice(0, -1)}  }\n`;
  }

  code += "});";

  return code;
}

// python (requests) code generator
function generatePythonRequests(url: string): string {
  let headers: Record<string, string> = getHeaders();
  let bodyContent: string = getBodyContent();
  let method: string = getMethod();
  let bodyType: string = getBodyType();

  let code: string = `import requests, json\n\nresponse = requests.${method.toLowerCase()}(\n  "${url}",\n`;

  // check methods
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    if (bodyType === "Json") {
      try {
        JSON.parse(bodyContent);
      } catch {
        sendWarn("Invalid JSON Format");
        return "";
      }

      // escape quote
      bodyContent = bodyContent.replaceAll('"', '\\"');
      code += `  json = json.loads("""${bodyContent}"""),\n`;
    } else {
      // escape quote
      bodyContent = bodyContent.replaceAll('"', '\\"');
      code += `  data = """${bodyContent}""",\n`;
    }
  }

  // check header exists
  if (Object.keys(headers).length > 0) {
    let headerStr: string = JSON.stringify(headers);
    headerStr = headerStr.replaceAll('"', '\\"');

    code += `  headers = json.loads("""${headerStr}""")\n`;
  }

  code += ")";

  return code;
}

export { codeGenerator };
