// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

// Struct for request saves
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SaveRequest {
    name: String,
    key: String,
    url: String,
    method: String,
    body: String,
    body_type: String,
    headers: HashMap<String, String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default)]
    query_parameters: Option<HashMap<String, String>>,
}

// get save file
fn get_save_path() -> PathBuf {
    let mut config_path = tauri::api::path::config_dir().unwrap();
    config_path.push(Path::new("request_saves.json"));

    config_path
}

// initialize save file
pub fn init_save_file() {
    let save_path = get_save_path();

    // check if exists
    if !Path::new(&save_path).is_file() {
        fs::write(&save_path, "[]").expect("can't write save file");
    }
}

// read save file
fn read_save_file() -> String {
    let save_path = get_save_path();
    fs::read_to_string(save_path).expect("can't read save file")
}

// write save file
fn write_save_file(content: String) {
    let save_path = get_save_path();
    fs::write(&save_path, content).expect("can't write save file");
}

// load json file
#[tauri::command]
pub fn read_json_file() -> Vec<SaveRequest> {
    let json_content = read_save_file();
    let datas: Vec<SaveRequest> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    datas
}

// write to json file
#[tauri::command]
pub fn write_json_file(save: SaveRequest) {
    let json_content = read_save_file();
    let mut datas: Vec<SaveRequest> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    // check if same name
    if datas.iter().any(|val| val.name == save.name) {
        let index = datas.iter().position(|val| val.name == save.name).unwrap();
        datas[index] = save;
    } else {
        datas.push(save);
    }

    let new_content = serde_json::to_string(&datas).expect("can't encode file struct");
    write_save_file(new_content);
}

// remove from json file
#[tauri::command]
pub fn remove_from_json_file(save: SaveRequest) {
    let json_content = read_save_file();
    let mut datas: Vec<SaveRequest> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    let filter_content = save.name;

    // remove save
    datas.retain(|obj| obj.name != filter_content);

    let new_content = serde_json::to_string(&datas).expect("can't encode file struct");
    write_save_file(new_content);
}
