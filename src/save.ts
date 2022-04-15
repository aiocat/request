// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { HttpVerb } from "@tauri-apps/api/http";
import { invoke } from "@tauri-apps/api";
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

  let titleSplitted: Array<string> = url.split("/").filter((v: string) => v != "");
  let title: string = titleSplitted[titleSplitted.length - 1];

  if (title.length > 9) {
    title = `${title.substring(7)}...`;
  }

  // save to file
  invoke("write_json_file", {
    save: {
      name: title,
      key: url + method,
      url,
      method,
      body,
      bodyType,
      headers,
    },
  });

  // reload storage
  loadStorage(null);
};

// get local storage data and write to DOM
async function loadStorage(filter: string | null) {
  let saves: HTMLDivElement | null =
    document.querySelector<HTMLDivElement>("#saves");

  // reset saves DOM
  saves!.innerHTML = "";

  // load file
  let jsonFile: Array<Record<string, any>> = await invoke("read_json_file");

  // iterate over file
  for (const object of jsonFile) {
    if (filter && object.key.indexOf(filter) === -1) continue;

    let saveElement: HTMLDivElement = document.createElement("div");
    saveElement.className = "saved";

    let titleElement: HTMLHeadingElement = document.createElement("h1");
    titleElement.innerText = object.name;

    let typeElement: HTMLHeadingElement = document.createElement("h2");
    typeElement.innerText = object.method;

    let deleteSave: HTMLButtonElement = document.createElement("button");
    deleteSave.innerText = "Delete";
    deleteSave.className = "delete-save";

    // delete save when clicked
    deleteSave.onclick = async (): Promise<void> => {
      await invoke("remove_from_json_file", { save: object });
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

      aceRequest.setValue(object.body);
      requestUrlElement!.value = object.url;
      requestMethodElement!.value = object.method;
      bodyTypeElement!.value = object.bodyType;
      writeRequestHeaders(object.headers);

      checkMethod();
    };

    saveElement.appendChild(titleElement);
    saveElement.appendChild(typeElement);
    saveElement.appendChild(loadSave);
    saveElement.appendChild(deleteSave);

    saves!.appendChild(saveElement);
  }
}
