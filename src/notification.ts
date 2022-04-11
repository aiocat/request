// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

function sendNotification(message: string): void {
    let warn: HTMLDivElement = document.createElement("div");
    warn.className = "warn";
    warn.innerText = message;
    warn.onclick = () => warn.remove();

    let warnStack: HTMLDivElement | null = document.querySelector("#warn-stack");
    warnStack!.appendChild(warn);
}

export { sendNotification };