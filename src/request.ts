// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { FetchOptions, HttpVerb } from "@tauri-apps/api/http";
import { fetch as tauriFetch, Response as tauriResponse } from "@tauri-apps/api/http";
import { getBody, getHeaders, getUrl, getMethod } from "./requestDom";

let requestMethodElement: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>("#http-type");
let sendButton: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#send");

requestMethodElement!.onchange = () => {
    let bodyDocument: HTMLTextAreaElement | null = document.querySelector<HTMLTextAreaElement>("#request-body");

    if (requestMethodElement!.selectedIndex === 0 || requestMethodElement!.selectedIndex === 4 || requestMethodElement!.selectedIndex === 5) {
        bodyDocument!.disabled = true;
        bodyDocument!.style.cursor = "not-allowed";
        bodyDocument!.value = "";
    }
    else {
        bodyDocument!.disabled = false;
        bodyDocument!.style.cursor = "text";
    }
}

sendButton!.onclick = async (): Promise<void> => {
    let requestMethod: HttpVerb = getMethod();

    let timeNow: number = Date.now();
    let fetchOptions: FetchOptions = {
        method: requestMethod,
        responseType: 2,
        headers: getHeaders()
    };

    if (requestMethod == "POST" || requestMethod == "PUT" || requestMethod == "PATCH") {
        let body = getBody();
        if (!body) return;

        fetchOptions.body = body;
    }

    let url: string | null = getUrl();
    if (!url) return;

    let response: tauriResponse<string> = await tauriFetch(url, fetchOptions);
    let responseMillisecond: number = Date.now() - timeNow;
    let responseBody: string = response.data;

    writeResponse(responseBody);
    writeStats(response, responseBody, responseMillisecond);
    writeHeaders(response.headers);
}

function writeResponse(content: string): void {
    let responseTextElement: HTMLTextAreaElement | null = document.querySelector<HTMLTextAreaElement>("#response-text");
    responseTextElement!.value = content;
}

function writeStats(response: tauriResponse<string>, content: string, speed: number): void {
    let responseStatusElement: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#r-status");
    let responseByteElement: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#r-byte");
    let responseSpeedElement: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#r-ms");

    responseStatusElement!.innerText = response.status.toString();
    responseByteElement!.innerText = `${(new TextEncoder().encode(content)).length}B`;
    responseSpeedElement!.innerText = `${speed}ms`;
}

function writeHeaders(headers: Record<string, string>): void {
    let headersDiv: HTMLDivElement | null = document.querySelector<HTMLDivElement>("#response-headers");
    headersDiv!.innerHTML = "";

    for (let key in headers) {
        let value: string = headers[key];

        let header: HTMLDivElement = document.createElement("div");
        header.className = "header";

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