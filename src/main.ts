// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import "./style.css";
import spawnRequest from "./request";
import "./responseButtons";

let sendButton: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#send");

if (sendButton) {
  sendButton.onclick = spawnRequest;
}