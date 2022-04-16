// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { HttpVerb } from "@tauri-apps/api/http";
import { sendWarn } from "./notification";
import { aceRequest } from "./aceEditor";

// convert headers to typescript records (hashmap)
function getHeaders(): Record<string, string> {
  let records: Record<string, string> = {};
  let headersDiv: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>("#headers");

  if (headersDiv!.childElementCount < 1) return records;

  headersDiv!.childNodes.forEach((element: any) => {
    let inputs: any = element.childNodes[0].childNodes;
    let key: HTMLInputElement = inputs[0];
    let value: HTMLInputElement = inputs[1];

    records[key.value] = value.value;
  });

  return records;
}

// get body content
function getBodyContent(): string {
  return aceRequest.getValue();
}

// get body type (None, Json, Bytes, Text)
function getBodyType(): string {
  let bodyTypeElement: HTMLSelectElement | null =
    document.querySelector<HTMLSelectElement>("#body-type");
  return bodyTypeElement!.value;
}

// get request method
function getMethod(): HttpVerb {
  let requestMethodElement: HTMLSelectElement | null =
    document.querySelector<HTMLSelectElement>("#http-type");

  const requestMethods: Array<HttpVerb> = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ];
  return requestMethods[requestMethodElement!.selectedIndex];
}

// get url
function getUrl(): string | null {
  let requestUrlElement: HTMLInputElement | null =
    document.querySelector<HTMLInputElement>("#url");
  let url: string = requestUrlElement!.value;

  // check if url valid
  if (/https?:\/\/.*?\..*/g.test(url)) return requestUrlElement!.value;
  else {
    sendWarn("Invalid URL");
    return null;
  }
}

// write request headers (for save loading)
function writeRequestHeaders(headers: Record<string, string>): void {
  let headersDiv: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>("#headers");
  headersDiv!.innerHTML = "";

  for (let key in headers) {
    let header: HTMLDivElement = document.createElement("div");
    header.className = "header";

    let container: HTMLSpanElement = document.createElement("span");

    let headerKey: HTMLInputElement = document.createElement("input");
    headerKey.type = "text";
    headerKey.value = key;

    let headerValue: HTMLInputElement = document.createElement("input");
    headerValue.type = "text";
    headerValue.value = headers[key];

    let headerDeleter: HTMLButtonElement = document.createElement("button");
    headerDeleter.onclick = () => header.remove();
    headerDeleter.innerText = "Delete";

    container.appendChild(headerKey);
    container.appendChild(headerValue);

    header.appendChild(container);
    header.appendChild(headerDeleter);

    headersDiv!.appendChild(header);
  }
}

// check selected method
function checkMethod(): void {
  let requestMethodElement: HTMLSelectElement | null =
    document.querySelector<HTMLSelectElement>("#http-type");

  if (
    requestMethodElement!.selectedIndex === 0 ||
    requestMethodElement!.selectedIndex === 4
  ) {
    aceRequest.setReadOnly(true);
    aceRequest.setValue("");
  } else {
    aceRequest.setReadOnly(false);
  }
}

// edit body mode
function editBodyMode(): void {
  let bodyType: string = getBodyType();

  if (bodyType === "Json") aceRequest.getSession().setMode("ace/mode/json");
  else aceRequest.getSession().setMode("ace/mode/plain_text");
}

export {
  getHeaders,
  getUrl,
  getMethod,
  getBodyContent,
  getBodyType,
  writeRequestHeaders,
  checkMethod,
  editBodyMode,
};
