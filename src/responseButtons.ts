// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { writeText } from "@tauri-apps/api/clipboard";
import { sendNotification } from "./notification";

let clearButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#clear-response");
let copyButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#copy-response");
let responseTextElement: HTMLTextAreaElement | null =
  document.querySelector<HTMLTextAreaElement>("#response-text");

// clear body content
clearButton!.onclick = (): void => {
  responseTextElement!.value = "";
};

// copy body content
copyButton!.onclick = (): void => {
  let content: string = responseTextElement!.value;
  writeText(content);
  sendNotification("Body copied to clipboard");
};
