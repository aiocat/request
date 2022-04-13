// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { HttpVerb } from "@tauri-apps/api/http";
import {
  getBodyContent,
  getBodyType,
  getHeaders,
  getUrl,
  getMethod,
  writeRequestHeaders,
  checkMethod,
} from "./requestDom";
import { aceRequest } from "./aceEditor";

let saveButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#save");
let filterSaves: HTMLInputElement | null =
  document.querySelector<HTMLInputElement>("#filter-saves");

// load all of the items from storage
loadStorage(null);

// filter saves
filterSaves!.oninput = () => {
  loadStorage(filterSaves!.value);
};

// save current options
saveButton!.onclick = () => {
  // check if url valid
  let url: string | null = getUrl();
  if (!url) return;

  let method: HttpVerb = getMethod();
  let body: string = getBodyContent();
  let bodyType: string = getBodyType();
  let headers: Record<string, string> = getHeaders();

  let titleSplitted: Array<string> = url.split("/");
  let title: string = titleSplitted[titleSplitted.length - 1];

  if (title.length > 9) {
    title = `${title.substring(7)}...`;
  }

  // save to localstorage
  localStorage.setItem(
    title + method,
    JSON.stringify({
      title,
      url,
      method,
      body,
      bodyType,
      headers: JSON.stringify(headers),
    })
  );

  // reload storage
  loadStorage(null);
};

// get local storage data and write to DOM
function loadStorage(filter: string | null) {
  let saves: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>("#saves");

  // reset saves DOM
  saves!.innerHTML = "";

  // iterate over local storage
  for (let [key, value] of Object.entries(localStorage)) {
    if (filter && key.indexOf(filter) === -1) continue;

    let objectized = JSON.parse(value);

    let saveElement: HTMLDivElement = document.createElement("div");
    saveElement.className = "saved";

    let titleElement: HTMLHeadingElement = document.createElement("h1");
    titleElement.innerText = objectized.title;

    let typeElement: HTMLHeadingElement = document.createElement("h2");
    typeElement.innerText = objectized.method;

    let deleteSave: HTMLButtonElement = document.createElement("button");
    deleteSave.innerText = "Delete";
    deleteSave.className = "delete-save";

    // delete save when clicked
    deleteSave.onclick = (): void => {
      localStorage.removeItem(key);
      saveElement.remove();
    };

    let loadSave: HTMLButtonElement = document.createElement("button");
    loadSave.innerText = "Load";
    loadSave.className = "load-save";

    // load save when clicked
    loadSave.onclick = (): void => {
      let requestUrlElement: HTMLInputElement | null =
        document.querySelector<HTMLInputElement>("#url");
      let requestMethodElement: HTMLSelectElement | null =
        document.querySelector<HTMLSelectElement>("#http-type");
      let bodyTypeElement: HTMLSelectElement | null =
        document.querySelector<HTMLSelectElement>("#body-type");

      aceRequest.setValue(objectized.body);
      requestUrlElement!.value = objectized.url;
      requestMethodElement!.value = objectized.method;
      bodyTypeElement!.value = objectized.bodyType;
      writeRequestHeaders(JSON.parse(objectized.headers));

      checkMethod();
    };

    saveElement.appendChild(titleElement);
    saveElement.appendChild(typeElement);
    saveElement.appendChild(loadSave);
    saveElement.appendChild(deleteSave);

    saves!.appendChild(saveElement);
  }
}
