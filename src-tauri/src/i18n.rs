// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

use reqwest;
use std::fs;
use std::path::{Path, PathBuf};

/*
#[derive(Serialize, Deserialize, Debug)]
pub struct LanguageConfig {
    saves: SaveConfig,
    request: RequestConfig,
    response: ResponseConfig,
    code_generator: CodeGenerationConfig
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SaveConfig {
    input: String,
    filter_button: String,
    load_button: String,
    copy_button: String,
    remove_button: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RequestConfig {
    send_button: String,
    save_button: String,
    body: RequestBodyConfig,
    query_parameters: RequestQueryParametersConfig,
    headers: RequestHeadersConfig,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RequestBodyConfig {
    name: String,
    text: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RequestQueryParametersConfig {
    name: String,
    text: String,
    add_query: String,
    key_input: String,
    value_input: String,
    remove_button: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RequestHeadersConfig {
    name: String,
    text: String,
    add_query: String,
    key_input: String,
    value_input: String,
    remove_button: String
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ResponseConfig {
    body: ResponseBodyConfig,
    headers: ResponseHeadersConfig,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ResponseBodyConfig {
    name: String,
    status_text: String,
    size_text: String,
    time_text: String,
    copy_button: String,
    clear_button: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ResponseHeadersConfig {
    name: String,
    copy_button: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CodeGenerationConfig {
    select_text: String,
    copy_button: String,
}
*/

fn get_i18n_path() -> PathBuf {
    let mut config_path = tauri::api::path::config_dir().unwrap();
    config_path.push(Path::new("request_i18n"));

    config_path
}

#[tauri::command]
pub fn get_i18n() -> String {
    let i18n_path = get_i18n_path();
    let content = fs::read_to_string(i18n_path).expect("can't read i18n file");

    content
}

pub fn init_i18n_file() {
    let i18n_path = get_i18n_path();

    if !Path::new(&i18n_path).is_file() {
        fs::write(&i18n_path, "en").expect("can't write i18n file");
    }
}

#[tauri::command]
pub async fn fetch_i18n() -> String {
    let url = format!("https://raw.githubusercontent.com/aiocat/request-i18n/main/{}.json", get_i18n());

    let client = reqwest::Client::new();
    let response = client
      .get(url)
      .send().await.expect("can't send request");

    response.text().await.expect("can't get response content")
}

#[tauri::command]
pub fn write_i18n(language: String) {
    let i18n_path = get_i18n_path();
    fs::write(&i18n_path, language).expect("can't write i18n file");
}