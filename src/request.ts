// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { FetchOptions, HttpVerb, Response as tauriResponse } from "@tauri-apps/api/http"
import { fetch as tauriFetch } from "@tauri-apps/api/http"

async function spawnRequest(): Promise<void> {
    const requestMethods: Array<HttpVerb> = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
    let requestMethod: HttpVerb = "GET";
    let requestMethodElement: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>("#http-type");

    if (requestMethodElement)
        requestMethod = requestMethods[requestMethodElement.selectedIndex];

    let requestUrl: string = "";
    let requestUrlElement: HTMLInputElement | null = document.querySelector<HTMLInputElement>("#url");

    if (requestUrlElement)
        requestUrl = requestUrlElement.value;

    let timeNow: number = Date.now();
    let fetchOptions: FetchOptions = {
        method: requestMethod,
        responseType: 2
    }

    let response: tauriResponse<string> = await tauriFetch(requestUrl, fetchOptions);

    let responseMillisecond: number = Date.now() - timeNow;

    let responseBody: string = await response.data
    writeResponse(responseBody);
    writeStats(response, responseBody, responseMillisecond);
}

function writeResponse(content: string): void {
    let responseTextElement: HTMLTextAreaElement | null = document.querySelector<HTMLTextAreaElement>("#response-text");

    if (responseTextElement)
        responseTextElement.value = content;
}

function writeStats(response: tauriResponse<string>, content: string, speed: number): void {
    let responseStatusElement: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#r-status");
    let responseByteElement: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#r-byte");
    let responseSpeedElement: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>("#r-ms");

    if (responseStatusElement)
        responseStatusElement.innerText = response.status.toString();

    if (responseByteElement)
        responseByteElement.innerText = `${(new TextEncoder().encode(content)).length}B`;

    if (responseSpeedElement)
        responseSpeedElement.innerText = `${speed}ms`;
}

export default spawnRequest