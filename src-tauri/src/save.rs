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
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default)]
    folder: Option<String>,
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
pub fn read_json_file(folder: String) -> Vec<SaveRequest> {
    let json_content = read_save_file();
    let datas: Vec<SaveRequest> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    if folder == String::from("Unknown") {
        datas
            .into_iter()
            .filter(|value| value.folder.is_none())
            .collect()
    } else {
        datas
            .into_iter()
            .filter(|value| !value.folder.is_none() && &value.folder.as_ref().unwrap() == &&folder)
            .collect()
    }
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

// edit save name
#[tauri::command]
pub fn edit_save(old: String, new: String, folder: String) -> bool {
    let json_content = read_save_file();
    let mut datas: Vec<SaveRequest> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    // check if same name
    let index = datas.iter().position(|val| val.name == old).unwrap();
    if !datas.iter().any(|val| &val.name == &new) {
        datas[index].name = new;
    } else if old != new {
        return false;
    }

    // check if folder needs to change
    if folder != String::new() && folder != String::from("Unknown") {
        datas[index].folder = Some(folder);
    } else if folder == String::from("Unknown") {
        datas[index].folder = None;
    }

    let new_content = serde_json::to_string(&datas).expect("can't encode file struct");
    write_save_file(new_content);
    true
}

// remove folder
#[tauri::command]
pub fn remove_folder(folder: String) -> bool {
    if folder == String::from("Unknown") {
        return false;
    }

    let json_content = read_save_file();
    let mut datas: Vec<SaveRequest> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    // iterate and set found folders to None
    for data in datas.iter_mut() {
        if !data.folder.is_none() && &data.folder.as_ref().unwrap() == &&folder {
            (*data).folder = None;
        }
    }

    let new_content = serde_json::to_string(&datas).expect("can't encode file struct");
    write_save_file(new_content);
    true
}

// edit folder name
#[tauri::command]
pub fn edit_folder(folder: String, new: String) -> bool {
    if folder == String::from("Unknown") || new == String::from("Unknown") || folder == new {
        return false;
    }

    let json_content = read_save_file();
    let mut datas: Vec<SaveRequest> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    // edit folders
    for data in datas.iter_mut() {
        if data.folder.is_none() {
            continue;
        }

        let calculated = &data.folder.as_ref().unwrap();

        if calculated == &&folder {
            (*data).folder = Some(new.clone());
        } else if calculated == &&new {
            return false;
        }
    }

    let new_content = serde_json::to_string(&datas).expect("can't encode file struct");
    write_save_file(new_content);
    true
}

// collect folders
#[tauri::command]
pub fn collect_folders() -> Vec<String> {
    let mut collected: Vec<String> = vec![String::from("Unknown")];
    let json_content = read_save_file();
    let datas: Vec<SaveRequest> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    // collect folders
    for data in &datas {
        if data.folder.is_none() {
            continue;
        }

        let calculated = data.folder.as_ref().unwrap();
        if !collected.contains(&calculated) {
            collected.push(calculated.to_string());
        }
    }

    collected
}
