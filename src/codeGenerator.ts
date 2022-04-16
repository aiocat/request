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
codeGenerateButton!.onclick = codeGenerator;

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
    case "Go (net/http)":
      aceCode.getSession().setMode("ace/mode/golang");
      aceCode.setValue(generateGoNetHttp(url));
      break;
    case "Rust (reqwest)":
      aceCode.getSession().setMode("ace/mode/rust");
      aceCode.setValue(generateRustReqwest(url));
      break;
  }
}

// javascript (fetch api) code generator
function generateJavaScriptFetch(url: string): string {
  let headers: Record<string, string> = getHeaders();
  let bodyContent: string = getBodyContent();
  let method: string = getMethod();
  let bodyType: string = getBodyType();

  let bodyTypeIsNone: boolean = getBodyType() === "None";
  let code: string = `let response = await fetch("${url}", {\n  method: "${method}",\n`;

  // check method
  if (
    (method === "POST" || method === "PUT" || method === "PATCH") &&
    !bodyTypeIsNone
  ) {
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

  let bodyTypeIsNone: boolean = getBodyType() === "None";
  let code: string = `import requests, json\n\nresponse = requests.${method.toLowerCase()}(\n  "${url}",\n`;

  // check methods
  if (
    (method === "POST" || method === "PUT" || method === "PATCH") &&
    !bodyTypeIsNone
  ) {
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

// go (net/http) code generator
function generateGoNetHttp(url: string): string {
  let headers: Record<string, string> = getHeaders();
  let bodyContent: string = getBodyContent();
  let method: string = getMethod();
  let bodyType: string = getBodyType();

  let bodyTypeIsNone: boolean = getBodyType() === "None";
  let code: string =
    'package main\n\nimport (\n  "net/http"\n  "bytes"\n)\n\nfunc main() {\n';

  // check method
  if (
    (method === "POST" || method === "PUT" || method === "PATCH") &&
    !bodyTypeIsNone
  ) {
    code += `  var requestData = []byte(\`${bodyContent.replaceAll(
      "`",
      '` + "`" + `'
    )}\`)\n`;
    code += `  request, _ := http.NewRequest("${method}", "${url}", bytes.NewBuffer(requestData))\n`;

    // check json is right
    if (bodyType === "Json") {
      try {
        JSON.parse(bodyContent);
      } catch {
        sendWarn("Invalid JSON Format");
        return "";
      }

      code += `  request.Header.Set("Content-Type", "application/json")\n`;
    }
  } else {
    code += `  request, _ := http.NewRequest("${method}", "${url}", nil)\n`;
  }

  // check header exists
  if (Object.keys(headers).length > 0) {
    for (let key in headers) {
      let value: string = headers[key];

      code += `  request.Header.Set("${key}", "${value}")\n`;
    }
  }

  code +=
    "\n  client := &http.Client{}\n  response, _ := client.Do(request)\n  // ...\n}";

  return code;
}

// rust (reqwest) code generator
function generateRustReqwest(url: string): string {
  let headers: Record<string, string> = getHeaders();
  let bodyContent: string = getBodyContent();
  let method: string = getMethod();
  let bodyType: string = getBodyType();

  let bodyTypeIsNone: boolean = getBodyType() === "None";
  let code: string =
    `// reqwest = "0.11.10"\n// tokio = { version = "1.17.0", features = ["rt-multi-thread", "macros"] }\n\nuse reqwest;\nuse tokio;\n\n#[tokio::main]\nasync fn main() -> Result<(), reqwest::Error> {\n  let client = reqwest::Client::new();\n  let response = client\n    .${method.toLowerCase()}("${url}")\n`;

  // check method
  if (
    (method === "POST" || method === "PUT" || method === "PATCH") &&
    !bodyTypeIsNone
  ) {
    // check if json
    if (bodyType === "Json") {
      try {
        JSON.parse(bodyContent);
      } catch {
        sendWarn("Invalid JSON Format");
        return "";
      }
      code += `    .body(r#"${bodyContent}"#)\n`
      code += `    .header("Content-Type", "application/json")\n`;
    } else {
      code += `    .body(r#"${bodyContent}"#)\n`
    }
  }

  // check header exists
  if (Object.keys(headers).length > 0) {
    for (let key in headers) {
      let value: string = headers[key];

      code += `    .header("${key}", "${value}")\n`;
    }
  }

  code +=
    "    .send().await?;\n\n  println!(\"{}\", response.status());\n\n  Ok(())\n}";

  return code;
}

export { codeGenerator };
