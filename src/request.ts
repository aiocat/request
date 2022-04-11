// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { FetchOptions, HttpVerb } from "@tauri-apps/api/http"
import { fetch as tauriFetch, Body as tauriBody, Response as tauriResponse } from "@tauri-apps/api/http"

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
    const requestMethods: Array<HttpVerb> = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
    const bodyContentTypes: Array<string> = ["Json", "Text", "Bytes"];
    let requestMethod: HttpVerb = "GET";

    requestMethod = requestMethods[requestMethodElement!.selectedIndex];

    let requestUrl: string = "";
    let requestUrlElement: HTMLInputElement | null = document.querySelector<HTMLInputElement>("#url");
    requestUrl = requestUrlElement!.value;

    let timeNow: number = Date.now();
    let fetchOptions: FetchOptions = {
        method: requestMethod,
        responseType: 2,
    };

    if (requestMethod == "POST" || requestMethod == "PUT" || requestMethod == "PATCH") {
        let bodyType: string = "";
        let bodyTypeElement: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>("#body-type");
        bodyType = bodyContentTypes[bodyTypeElement!.selectedIndex];

        let bodyContent: string = "";
        let bodyContentElement: HTMLTextAreaElement | null = document.querySelector<HTMLTextAreaElement>("#request-body");
        bodyContent = bodyContentElement!.value;

        let bodyParsed: tauriBody = tauriBody.text(bodyContent);

        if (bodyContent == "Json") {
            bodyParsed = tauriBody.json(JSON.parse(bodyType));
        } else if (bodyContent == "Text") {
            bodyParsed = tauriBody.text(bodyContent);
        } else if (bodyContent == "Bytes") {
            bodyParsed = tauriBody.bytes((new TextEncoder()).encode(bodyContent))
        }

        fetchOptions.body = bodyParsed
    }

    let response: tauriResponse<string> = await tauriFetch(requestUrl, fetchOptions);
    let responseMillisecond: number = Date.now() - timeNow;
    let responseBody: string = response.data;

    writeResponse(responseBody);
    writeStats(response, responseBody, responseMillisecond);
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