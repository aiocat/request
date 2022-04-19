// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { NotificationType, PositionX, PositionY } from "./types";

export class Totify {
  /**
   * Initialize totify settings. (if don't exists)
   *
   * @remarks
   * This method is part of the {@link core-library#Totify | Totify subsystem}.
   *
   */
  public static init(posX: PositionX, posY: PositionY): void {
    let notificationDiv: HTMLElement | null = document.getElementById(
      "TOTIFY_NOTIFICATIONS"
    );
    if (notificationDiv) return;

    notificationDiv = document.createElement("div");
    notificationDiv.style.position = "fixed";
    notificationDiv.style.width = "312px";
    notificationDiv.style.height = "auto";
    notificationDiv.style.zIndex = "1337";
    notificationDiv.id = "TOTIFY_NOTIFICATIONS";

    switch (posX) {
      case "RIGHT":
        notificationDiv.style.right = "0px";
        break;
      case "LEFT":
        notificationDiv.style.left = "0px";
        break;
    }

    switch (posY) {
      case "TOP":
        notificationDiv.style.top = "0px";
        break;
      case "BOTTOM":
        notificationDiv.style.bottom = "0px";
        break;
    }

    document.body.appendChild(notificationDiv);
  }

  /**
   * Notification builder for Totify.
   *
   * @remarks
   * This method is part of the {@link core-library#Totify | Totify subsystem}.
   *
   * @param type - Notification type
   * @param text - Notification content
   *
   */
  public static build(type: NotificationType, text: string): void {
    let notificationDiv: HTMLElement | null = document.getElementById(
      "TOTIFY_NOTIFICATIONS"
    );
    if (!notificationDiv) return;

    let notification = document.createElement("div");
    notification.innerText = text;
    notification.style.padding = "5px";
    notification.style.margin = "5px";
    notification.style.borderRadius = "5px";
    notification.style.cursor = "pointer";
    notification.onclick = (): void => notification.remove();

    switch (type) {
      case "INFO":
        notification.style.background = "#3498db";
        notification.style.borderBottom = "4px solid #2084c7";
        break;
      case "ERROR":
        notification.style.background = "#e74c3c";
        notification.style.borderBottom = "4px solid #d33828";
        break;
      case "SUCCESS":
        notification.style.background = "#2ecc71";
        notification.style.borderBottom = "4px solid #1ab85c";
        break;
      case "WARN":
        notification.style.background = "#f39c12";
        notification.style.borderBottom = "4px solid #cf8611";
        break;
    }

    notificationDiv.appendChild(notification);
  }

  /**
   * Info wrapper for Totify.
   *
   * @remarks
   * This method is part of the {@link core-library#Totify | Totify subsystem}.
   *
   * @param text - Notification content
   *
   */
  public static info(text: string): void {
    Totify.build("INFO", text);
  }

  /**
   * Warn wrapper for Totify.
   *
   * @remarks
   * This method is part of the {@link core-library#Totify | Totify subsystem}.
   *
   * @param text - Notification content
   *
   */
  public static warn(text: string): void {
    Totify.build("WARN", text);
  }

  /**
   * Error wrapper for Totify.
   *
   * @remarks
   * This method is part of the {@link core-library#Totify | Totify subsystem}.
   *
   * @param text - Notification content
   *
   */
  public static error(text: string): void {
    Totify.build("ERROR", text);
  }

  /**
   * Success wrapper for Totify.
   *
   * @remarks
   * This method is part of the {@link core-library#Totify | Totify subsystem}.
   *
   * @param text - Notification content
   *
   */
  public static success(text: string): void {
    Totify.build("SUCCESS", text);
  }
}