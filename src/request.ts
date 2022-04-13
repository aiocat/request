// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { FetchOptions, HttpVerb } from "@tauri-apps/api/http";
import {
  fetch as tauriFetch,
  Response as tauriResponse,
} from "@tauri-apps/api/http";
import {
  getBody,
  getHeaders,
  getUrl,
  getMethod,
  checkMethod,
} from "./requestDom";
import { sendNotification } from "./notification";
import { codeGenerator } from "./codeGenerator";
import { writeText } from "@tauri-apps/api/clipboard";

let requestMethodElement: HTMLSelectElement | null =
  document.querySelector<HTMLSelectElement>("#http-type");
let sendButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#send");

// check method to see if uses body when request method changes
requestMethodElement!.onchange = checkMethod;

// send request
sendButton!.onclick = async (): Promise<void> => {
  let requestMethod: HttpVerb = getMethod();

  // calculate time
  let timeNow: number = Date.now();

  // fetch options
  let fetchOptions: FetchOptions = {
    method: requestMethod,
    responseType: 2,
    headers: getHeaders(),
  };

  // check method
  if (
    requestMethod == "POST" ||
    requestMethod == "PUT" ||
    requestMethod == "PATCH"
  ) {
    let body = getBody();
    if (!body) return;

    fetchOptions.body = body;
  }

  // check url format
  let url: string | null = getUrl();
  if (!url) return;

  // get response
  let response: tauriResponse<string> = await tauriFetch(url, fetchOptions);
  let responseMillisecond: number = Date.now() - timeNow;
  let responseBody: string = response.data;

  // write response
  writeResponse(responseBody);
  writeStats(response, responseBody, responseMillisecond);
  writeHeaders(response.headers);
  codeGenerator();
};

// write response content
function writeResponse(content: string): void {
  let responseTextElement: HTMLTextAreaElement | null =
    document.querySelector<HTMLTextAreaElement>("#response-text");
  responseTextElement!.value = content;
}

// write statuses
function writeStats(
  response: tauriResponse<string>,
  content: string,
  speed: number
): void {
  let responseStatusElement: HTMLParagraphElement | null =
    document.querySelector<HTMLParagraphElement>("#r-status");
  let responseByteElement: HTMLParagraphElement | null =
    document.querySelector<HTMLParagraphElement>("#r-byte");
  let responseSpeedElement: HTMLParagraphElement | null =
    document.querySelector<HTMLParagraphElement>("#r-ms");

  responseStatusElement!.innerText = response.status.toString();
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
