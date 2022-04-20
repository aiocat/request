// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Totify } from "../notify/index";
import type { Request } from "../types/Request";
import {
  generateQueryParameterTail,
  nestedToRecord,
} from "../helpers/objectFormatter";

// javascript (fetch api) code generator
export function generateJavaScriptFetch(request: Request): string {
  let bodyTypeIsNone: boolean = request.bodyType === "None";
  let newUrl = request.url;

  // add query parameter (if exists)
  newUrl += generateQueryParameterTail(request.queryParameters);

  let code: string = `let response = await fetch("${newUrl}", {\n  method: "${request.method}",\n`;

  // check method
  if (
    (request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "PATCH") &&
    !bodyTypeIsNone
  ) {
    if (request.bodyType === "Json") {
      try {
        JSON.parse(request.body);
      } catch {
        Totify.error("Invalid JSON Format");
        return "";
      }

      code += `  body: JSON.stringify(${request.body}),\n`;
    } else {
      // escape `
      code += `  body: \`${request.body.replaceAll("`", "\\`")}\`,\n`;
    }
  }

  // check header exists
  if (request.headers.length > 0) {
    code += `  headers: ${JSON.stringify(
      nestedToRecord(request.headers),
      null,
      4
    ).slice(0, -1)}  }\n`;
  }

  code += "});";
  return code;
}

// python (requests) code generator
export function generatePythonRequests(request: Request): string {
  let bodyTypeIsNone: boolean = request.bodyType === "None";
  let newUrl = request.url;

  // add query parameter (if exists)
  newUrl += generateQueryParameterTail(request.queryParameters);

  let code: string = `import requests, json\n\nresponse = requests.${request.method.toLowerCase()}(\n  "${newUrl}",\n`;

  // check methods
  if (
    (request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "PATCH") &&
    !bodyTypeIsNone
  ) {
    if (request.bodyType === "Json") {
      try {
        JSON.parse(request.body);
      } catch {
        Totify.error("Invalid JSON Format");
        return "";
      }

      // escape quote
      code += `  json = json.loads("""$request.body.value.replaceAll(
        '"',
        '\\"'
      )}"""),\n`;
    } else {
      // escape quote
      code += `  data = """${request.body.replaceAll('"', '\\"')}""",\n`;
    }
  }

  // check header exists
  if (request.headers.length > 0) {
    let headerStr: string = JSON.stringify(nestedToRecord(request.headers));
    headerStr = headerStr.replaceAll('"', '\\"');

    code += `  headers = json.loads("""${headerStr}""")\n`;
  }

  code += ")";
  return code;
}

// go (net/http) code generator
export function generateGoNetHttp(request: Request): string {
  let bodyTypeIsNone: boolean = request.bodyType === "None";
  let newUrl = request.url;
  let code: string =
    'package main\n\nimport (\n  "net/http"\n  "bytes"\n)\n\nfunc main() {\n';

  // add query parameter (if exists)
  newUrl += generateQueryParameterTail(request.queryParameters);

  // check method
  if (
    (request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "PATCH") &&
    !bodyTypeIsNone
  ) {
    code += `  var requestData = []byte(\`${request.body.replaceAll(
      "`",
      '` + "`" + `'
    )}\`)\n`;
    code += `  request, _ := http.NewRequest("${request.method}", "${newUrl}", bytes.NewBuffer(requestData))\n`;

    // check json is right
    if (request.bodyType === "Json") {
      try {
        JSON.parse(request.body);
      } catch {
        Totify.error("Invalid JSON Format");
        return "";
      }

      code += `  request.Header.Set("Content-Type", "application/json")\n`;
    }
  } else {
    code += `  request, _ := http.NewRequest("${request.method}", "${newUrl}", nil)\n`;
  }

  // check header exists
  if (request.headers.length > 0) {
    for (let data in request.headers) {
      code += `  request.Header.Set("${request.headers[data][0]}", "${request.headers[data][1]}")\n`;
    }
  }

  code +=
    "\n  client := &http.Client{}\n  response, _ := client.Do(request)\n  // ...\n}";

  return code;
}

// rust (reqwest) code generator
export function generateRustReqwest(request: Request): string {
  let bodyTypeIsNone: boolean = request.bodyType === "None";
  let newUrl: string = request.url;

  // add query parameter (if exists)
  newUrl += generateQueryParameterTail(request.queryParameters);

  let code: string = `// reqwest = "0.11.10"\n// tokio = { version = "1.17.0", features = ["rt-multi-thread", "macros"] }\n\nuse reqwest;\nuse tokio;\n\n#[tokio::main]\nasync fn main() -> Result<(), reqwest::Error> {\n  let client = reqwest::Client::new();\n  let response = client\n    .${request.method.toLowerCase()}("${newUrl}")\n`;

  // check method
  if (
    (request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "PATCH") &&
    !bodyTypeIsNone
  ) {
    // check if json
    if (request.bodyType === "Json") {
      try {
        JSON.parse(request.body);
      } catch {
        Totify.error("Invalid JSON Format");
        return "";
      }
      code += `    .body(r#"${request.body}"#)\n`;
      code += `    .header("Content-Type", "application/json")\n`;
    } else {
      code += `    .body(r#"${request.body}"#)\n`;
    }
  }

  // check header exists
  if (request.headers.length > 0) {
    for (let data in request.headers) {
      code += `    .header("${request.headers[data][0]}", "${request.headers[data][1]}")\n`;
    }
  }

  code +=
    '    .send().await?;\n\n  println!("{}", response.status());\n\n  Ok(())\n}';

  return code;
}
