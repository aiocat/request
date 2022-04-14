// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { writeText } from "@tauri-apps/api/clipboard";
import { sendNotification } from "./notification";
import { aceResponse } from "./aceEditor";

let clearButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#clear-response");
let copyButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#copy-response");

// clear body content
clearButton!.onclick = (): void => {
  aceResponse.setValue("");
};

// copy body content
copyButton!.onclick = (): void => {
  writeText(aceResponse.getValue());
  sendNotification("Body copied to clipboard");
};
