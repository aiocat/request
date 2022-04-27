#![cfg_attr(
// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod i18n;
mod request;
mod save;

// taken from: https://github.com/FabianLars/mw-toolbox/
#[cfg(target_os = "macos")]
mod menu;

fn main() {
    save::init_save_file();
    i18n::init_i18n_file();

    let builder = tauri::Builder::default();
    // taken from: https://github.com/FabianLars/mw-toolbox/
    #[cfg(target_os = "macos")]
    let builder = builder.menu(menu::menu());

    builder
        .invoke_handler(tauri::generate_handler![
            save::read_json_file,
            save::write_json_file,
            save::remove_from_json_file,
            save::edit_save_name,
            request::send_request,
            i18n::fetch_i18n,
            i18n::write_i18n,
            i18n::get_i18n,
            i18n::fetch_i18n_translations
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
