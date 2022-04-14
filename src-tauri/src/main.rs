#![cfg_attr(
// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  let builder = tauri::Builder::default();
  
  #[cfg(target_os = "macos")]
  let builder = builder.menu(menu::menu());

  builder
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
