// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let headersDiv: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>("#headers");
let createHeaderButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#add-header");
// let headers: Array<Record<string, any>> = [];

// generate request headers
createHeaderButton!.onclick = (): void => {
  let header: HTMLDivElement = document.createElement("div");
  header.className = "header";

  let container: HTMLSpanElement = document.createElement("span");

  let headerKey: HTMLInputElement = document.createElement("input");
  headerKey.type = "text";
  headerKey.name = "key";
  headerKey.placeholder = "Key";

  let headerValue: HTMLInputElement = document.createElement("input");
  headerValue.type = "text";
  headerValue.name = "value";
  headerValue.placeholder = "Value";

  let headerDeleter: HTMLButtonElement = document.createElement("button");
  headerDeleter.onclick = () => header.remove();
  headerDeleter.innerText = "Delete";

  container.appendChild(headerKey);
  container.appendChild(headerValue);

  header.appendChild(container);
  header.appendChild(headerDeleter);

  headersDiv!.appendChild(header);
};
