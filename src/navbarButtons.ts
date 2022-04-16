// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { aceCode, aceRequest, aceResponse } from "./aceEditor";

let requestButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#open-request");
let responseButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#open-response");
let codeButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>("#open-code");

let requestDivElement: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>("#request");
let responseDivElement: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>("#response");
let codeDivElement: HTMLDivElement | null =
  document.querySelector<HTMLDivElement>("#code");

responseDivElement!.style.display = "none";
codeDivElement!.style.display = "none";

// open request div
requestButton!.onclick = (): void => {
  requestDivElement!.style.display = "block";
  responseDivElement!.style.display = "none";
  codeDivElement!.style.display = "none";

  aceRequest.selectPageUp();
};

// open repsonse div
responseButton!.onclick = (): void => {
  requestDivElement!.style.display = "none";
  responseDivElement!.style.display = "block";
  codeDivElement!.style.display = "none";

  aceResponse.selectPageUp();
};

// open code div
codeButton!.onclick = (): void => {
  requestDivElement!.style.display = "none";
  responseDivElement!.style.display = "none";
  codeDivElement!.style.display = "block";

  aceCode.selectPageUp();
};
