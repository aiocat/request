// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { HttpVerb } from "@tauri-apps/api/http";
import { invoke } from "@tauri-apps/api";
import {
  getHeaders,
  getUrl,
  getMethod,
  editBodyMode,
  getBodyType,
  getBodyContent,
} from "./requestDom";
import { sendNotification } from "./notification";
import { codeGenerator } from "./codeGenerator";
import { writeText } from "@tauri-apps/api/clipboard";
import { aceResponse } from "./aceEditor";

let sendButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#send");
let bodyTypeElement: HTMLSelectElement | null =
  document.querySelector<HTMLSelectElement>("#body-type");

// re-load theme for body type
bodyTypeElement!.onchange = editBodyMode;

// send request
sendButton!.onclick = async (): Promise<void> => {
  // get request method
  let method: HttpVerb = getMethod();

  // calculate time
  let timeNow: number = Date.now();

  // get body
  let body: string = getBodyContent();

  // get body type
  let bodyType: string = getBodyType();

  // get headers
  let headers: Record<string, string> = getHeaders();

  // check url format
  let url: string | null = getUrl();
  if (!url) return;

  let responseBody: string;
  let responseStatus: number;
  let responseHeaders: Record<string, string>;

  // get response
  let response: Record<string, any> = await invoke("send_request", {
    request: {
      url,
      method,
      body,
      bodyType,
      headers,
    },
  });

  responseBody = response.body;
  responseStatus = response.status;
  responseHeaders = response.headers;

  let responseMillisecond: number = Date.now() - timeNow;

  // write response
  writeResponse(responseHeaders["content-type"], responseBody);
  writeStats(responseStatus, responseBody, responseMillisecond);
  writeHeaders(responseHeaders);
  codeGenerator();
};

// write response content
function writeResponse(type: string | null, content: string): void {
  if (!type) {
    aceResponse.getSession().setMode("ace/mode/plain_text");
  } else if (type.includes("json")) {
    aceResponse.getSession().setMode("ace/mode/json");
    aceResponse.setValue(JSON.stringify(JSON.parse(content), null, 2));
    return;
  } else if (type.includes("html")) {
    aceResponse.getSession().setMode("ace/mode/html");
  } else if (type.includes("css")) {
    aceResponse.getSession().setMode("ace/mode/css");
  } else if (type.includes("javascript")) {
    aceResponse.getSession().setMode("ace/mode/javascript");
  } else if (type.includes("xml") || type.includes("svg")) {
    aceResponse.getSession().setMode("ace/mode/xml");
  }

  aceResponse.setValue(content);
}

// write statuses
function writeStats(status: number, content: string, speed: number): void {
  let responseStatusElement: HTMLParagraphElement | null =
    document.querySelector<HTMLParagraphElement>("#r-status");
  let responseByteElement: HTMLParagraphElement | null =
    document.querySelector<HTMLParagraphElement>("#r-byte");
  let responseSpeedElement: HTMLParagraphElement | null =
    document.querySelector<HTMLParagraphElement>("#r-ms");

  responseStatusElement!.innerText = status.toString();

  if (status < 300 && status > 199) {
    responseStatusElement!.style.color = "#33d833";
  } else {
    responseStatusElement!.style.color = "#d83333";
  }

  responseByteElement!.innerText = `${
    new TextEncoder().encode(content).length
  }B`;
  responseSpeedElement!.innerText = `${speed}ms`;
}

// write headers
function writeHeaders(headers: Record<string, string>): void {
  let headersDiv: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>("#response-headers");
  headersDiv!.innerHTML = "";

  for (let key in headers) {
    let value: string = headers[key];

    let header: HTMLDivElement = document.createElement("div");
    header.className = "header";
    header.onclick = () => {
      writeText(`${key}: ${value}`);
      sendNotification("Header copied to clipboard");
    };

    let headerKey: HTMLParagraphElement = document.createElement("p");
    headerKey.innerText = key;

    let headerValue: HTMLInputElement = document.createElement("input");
    headerValue.type = "text";
    headerValue.name = "value";
    headerValue.readOnly = true;
    headerValue.value = value;

    header.appendChild(headerKey);
    header.appendChild(headerValue);

    headersDiv!.appendChild(header);
  }
}
