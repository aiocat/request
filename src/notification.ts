// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// send warn notification
function sendWarn(message: string): void {
  let warn: HTMLDivElement = document.createElement("div");
  warn.className = "warn";
  warn.innerText = message;
  warn.onclick = () => warn.remove();

  let notificationStack: HTMLDivElement | null = document.querySelector(
    "#notification-stack"
  );
  notificationStack!.appendChild(warn);
}

// send normal notification
function sendNotification(message: string): void {
  let notification: HTMLDivElement = document.createElement("div");
  notification.className = "notification";
  notification.innerText = message;
  notification.onclick = () => notification.remove();

  let notificationStack: HTMLDivElement | null = document.querySelector(
    "#notification-stack"
  );
  notificationStack!.appendChild(notification);
}

export { sendWarn, sendNotification };
