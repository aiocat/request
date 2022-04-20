// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Totify } from "../notify/index";
import type { Request } from "../types/Request";
import { generateQueryParameterTail } from "../helpers/objectFormatter";

// javascript (fetch api) code generator
export function generateJavaScriptFetch(obj: Request): string {
  let bodyTypeIsNone: boolean = obj.bodyType === "None";
  let newUrl = obj.url;

  // add query parameter (if exists)
  newUrl += generateQueryParameterTail(obj.queryParameters);

  let code: string = `let response = await fetch("${newUrl}", {\n  method: "${obj.method}",\n`;

  // check method
  if (
    (obj.method === "POST" || obj.method === "PUT" || obj.method === "PATCH") &&
    !bodyTypeIsNone
  ) {
    if (obj.bodyType === "Json") {
      try {
        JSON.parse(obj.body);
      } catch {
        Totify.error("Invalid JSON Format");
        return "";
      }

      code += `  body: JSON.stringify(${obj.body}),\n`;
    } else {
      // escape `
      code += `  body: \`${obj.body.replaceAll("`", "\\`")}\`,\n`;
    }
  }

  // check header exists
  if (obj.headers.length > 0) {
    let newHeaders: Record<string, string> = {};

    for (let data of obj.headers) {
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
export function generatePythonRequests(obj: Request): string {
  let bodyTypeIsNone: boolean = obj.bodyType === "None";
  let newUrl = obj.url;

  // add query parameter (if exists)
  newUrl += generateQueryParameterTail(obj.queryParameters);

  let code: string = `import requests, json\n\nresponse = requests.${obj.method.toLowerCase()}(\n  "${newUrl}",\n`;

  // check methods
  if (
    (obj.method === "POST" || obj.method === "PUT" || obj.method === "PATCH") &&
    !bodyTypeIsNone
  ) {
    if (obj.bodyType === "Json") {
      try {
        JSON.parse(obj.body);
      } catch {
        Totify.error("Invalid JSON Format");
        return "";
      }

      // escape quote
      code += `  json = json.loads("""$obj.body.value.replaceAll(
        '"',
        '\\"'
      )}"""),\n`;
    } else {
      // escape quote
      code += `  data = """${obj.body.replaceAll('"', '\\"')}""",\n`;
    }
  }

  // check header exists
  if (obj.headers.length > 0) {
    let newHeaders: Record<string, string> = {};

    for (let data of obj.headers) {
      newHeaders[data[0]] = data[1];
    }

    let headerStr: string = JSON.stringify(newHeaders);
    headerStr = headerStr.replaceAll('"', '\\"');

    code += `  headers = json.loads("""${headerStr}""")\n`;
  }

  code += ")";
  return code;
}
