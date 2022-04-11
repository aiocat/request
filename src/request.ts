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
    let requestMethod: HttpVerb = getMethod();

    let timeNow: number = Date.now();
    let fetchOptions: FetchOptions = {
        method: requestMethod,
        responseType: 2,
        headers: getHeaders()
    };

    if (requestMethod == "POST" || requestMethod == "PUT" || requestMethod == "PATCH") {
        fetchOptions.body = getBody();
    }

    let response: tauriResponse<string> = await tauriFetch(getUrl(), fetchOptions);
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

        let headerKey: HTMLInputElement = document.createElement("input");
        headerKey.type = "text";
        headerKey.name = "key";
        headerKey.value = key;

        let headerValue: HTMLInputElement = document.createElement("input");
        headerValue.type = "text";
        headerValue.name = "value";
        headerValue.value = value;

        header.appendChild(headerKey);
        header.appendChild(headerValue);

        headersDiv!.appendChild(header);
    }
}

function getHeaders(): Record<string, string> {
    let records: Record<string, string> = {};
    let headersDiv: HTMLDivElement | null = document.querySelector<HTMLDivElement>("#headers");

    if (headersDiv!.childElementCount < 1) return records;

    headersDiv!.childNodes.forEach((element: any) => {
        let inputs: any = element.childNodes[0].childNodes;
        let key: HTMLInputElement = inputs[0];
        let value: HTMLInputElement = inputs[1];

        records[key.value] = value.value;
    });

    return records;
}

function getBody(): tauriBody {
    const bodyContentTypes: Array<string> = ["Json", "Text", "Bytes"];

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
        bodyParsed = tauriBody.bytes((new TextEncoder()).encode(bodyContent));
    }

    return bodyParsed;
}

function getMethod(): HttpVerb {
    const requestMethods: Array<HttpVerb> = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
    return requestMethods[requestMethodElement!.selectedIndex];
}

function getUrl(): string {
    let requestUrlElement: HTMLInputElement | null = document.querySelector<HTMLInputElement>("#url");
    return requestUrlElement!.value;
}