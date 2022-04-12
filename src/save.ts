// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { HttpVerb } from '@tauri-apps/api/http';
import { getBodyContent, getBodyType, getHeaders, getUrl, getMethod, writeRequestHeaders, checkHeader } from "./requestDom";

let saveButton: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#save");
let filterSaves: HTMLInputElement | null = document.querySelector<HTMLInputElement>("#filter-saves");
loadStorage(null);

filterSaves!.oninput = () => {
    loadStorage(filterSaves!.value);
}

saveButton!.onclick = () => {
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

    localStorage.setItem(title + method, JSON.stringify({
        title, url, method, body, bodyType, headers: JSON.stringify(headers)
    }));

    loadStorage(null);
}

function loadStorage(filter: string | null) {
    let saves: HTMLDivElement | null = document.querySelector<HTMLDivElement>("#saves");
    saves!.innerHTML = "";

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

        deleteSave.onclick = (): void => {
            localStorage.removeItem(key);
            saveElement.remove();
        }

        let loadSave: HTMLButtonElement = document.createElement("button");
        loadSave.innerText = "Load";
        loadSave.className = "load-save";

        loadSave.onclick = (): void => {
            let bodyDocument: HTMLTextAreaElement | null = document.querySelector<HTMLTextAreaElement>("#request-body");
            let requestUrlElement: HTMLInputElement | null = document.querySelector<HTMLInputElement>("#url");
            let requestMethodElement: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>("#http-type");
            let bodyTypeElement: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>("#body-type");

            bodyDocument!.value = objectized.body;
            requestUrlElement!.value = objectized.url;
            requestMethodElement!.value = objectized.method;
            bodyTypeElement!.value = objectized.bodyType;
            writeRequestHeaders(JSON.parse(objectized.headers));

            checkHeader();
        }

        saveElement.appendChild(titleElement);
        saveElement.appendChild(typeElement);
        saveElement.appendChild(loadSave);
        saveElement.appendChild(deleteSave);

        saves!.appendChild(saveElement);
    }
}