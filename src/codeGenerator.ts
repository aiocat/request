// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getCodingLanguage, getHeaders, getBodyContent, getMethod, getUrl } from "./requestDom";

let codeBody: HTMLTextAreaElement | null = document.querySelector<HTMLTextAreaElement>("#code-body");
let codeGenerateButton: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#run-code-generator");

codeGenerateButton!.onclick = (): void => {
    codeGenerator();
}

function codeGenerator(): void {
    let language: string = getCodingLanguage();
    let url: string | null = getUrl();

    if (!url) return;

    switch (language) {
        case "JavaScript":
            codeBody!.value = generateJavaScript(url);
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

export { codeGenerator }