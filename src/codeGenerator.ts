// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getCodingLanguage, getHeaders, getBodyContent, getMethod, getUrl, getBodyType } from "./requestDom";
import { writeText } from "@tauri-apps/api/clipboard";
import { sendNotification } from "./notification";

let codeBody: HTMLTextAreaElement | null = document.querySelector<HTMLTextAreaElement>("#code-body");
let codeGenerateButton: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#run-code-generator");
let copyCode: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#copy-code");

codeGenerateButton!.onclick = (): void => {
    codeGenerator();
}

copyCode!.onclick = (): void => {
    writeText(codeBody!.value);
    sendNotification("Code copied to clipboard");
}

function codeGenerator(): void {
    let language: string = getCodingLanguage();
    let url: string | null = getUrl();

    if (!url) return;

    switch (language) {
        case "JavaScript":
            codeBody!.value = generateJavaScript(url);
            break;
        case "Python":
            codeBody!.value = generatePython(url);
            break;
    }
}

function generateJavaScript(url: string): string {
    let headers: Record<string, string> = getHeaders();
    let bodyContent: string = getBodyContent();
    let method: string = getMethod();

    let code: string = `let response = await fetch("${url}", {\n  method: "${method}",\n`;

    if (method === "POST" || method === "PUT" || method === "PATCH") {
        bodyContent = bodyContent.replaceAll("\"", "\\\"");
        code += `  body: "${bodyContent}",\n`;
    }

    if (Object.keys(headers).length > 0) {
        code += `  headers: ${JSON.stringify(headers, null, 4).slice(0, -1)}  }\n`;
    }

    code += "});"

    return code;
}

function generatePython(url: string): string {
    let headers: Record<string, string> = getHeaders();
    let bodyContent: string = getBodyContent();
    let method: string = getMethod();
    let bodyType: string = getBodyType();

    let code: string = `import requests, json\n\nresponse = requests.${method.toLowerCase()}(\n  "${url}",\n`;

    if (method === "POST" || method === "PUT" || method === "PATCH") {
        bodyContent = bodyContent.replaceAll("\"", "\\\"");

        if (bodyType === "Json") {
            code += `  json = json.loads("${bodyContent}"),\n`;
        } else {
            code += `  data = "${bodyContent}",\n`;
        }
    }

    if (Object.keys(headers).length > 0) {
        let headerStr: string = JSON.stringify(headers);
        headerStr = headerStr.replaceAll("\"", "\\\"");

        code += `  headers = json.loads("${headerStr}")\n`;
    }

    code += ")"

    return code;
}

export { codeGenerator }