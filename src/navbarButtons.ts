// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let requestButton: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#open-request");
let responseButton: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#open-response");

let requestDivElement: HTMLDivElement | null = document.querySelector<HTMLDivElement>("#request");
let responseDivElement: HTMLDivElement | null = document.querySelector<HTMLDivElement>("#response");

responseDivElement!.style.display = "none";

requestButton!.onclick = () => {
    requestDivElement!.style.display = "block";
    responseDivElement!.style.display = "none";
}

responseButton!.onclick = () => {
    requestDivElement!.style.display = "none";
    responseDivElement!.style.display = "block";
}