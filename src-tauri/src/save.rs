// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::env;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

// Struct for request saves
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Request {
    name: String,
    key: String,
    url: String,
    method: String,
    body: String,
    body_type: String,
    headers: HashMap<String, String>,
}

// get main dir
pub fn main_dir() -> io::Result<PathBuf> {
    let mut dir = env::current_exe()?;
    dir.pop();
    Ok(dir)
}

// get save file
fn get_save_path() -> PathBuf {
    let mut main_executable = main_dir().unwrap();
    main_executable.push(Path::new("saves.json"));

    main_executable
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
    let json_content = fs::read_to_string(save_path).expect("can't read save file");

    json_content
}

// write save file
fn write_save_file(content: String) {
    let save_path = get_save_path();
    fs::write(&save_path, content).expect("can't write save file");
}

// load json file
#[tauri::command]
pub fn read_json_file() -> Vec<Request> {
    let json_content = read_save_file();
    let datas: Vec<Request> = serde_json::from_str(&json_content).expect("can't decode json file");

    datas
}

// write to json file
#[tauri::command]
pub fn write_json_file(save: Request) {
    let json_content = read_save_file();
    let mut datas: Vec<Request> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    datas.push(save);

    let new_content = serde_json::to_string(&datas).expect("can't encode file struct");
    write_save_file(new_content);
}

// remove from json file
#[tauri::command]
pub fn remove_from_json_file(save: Request) {
    let json_content = read_save_file();
    let mut datas: Vec<Request> =
        serde_json::from_str(&json_content).expect("can't decode json file");

    let filter_content = save.name;
    datas.retain(|obj| &obj.name != &filter_content);

    let new_content = serde_json::to_string(&datas).expect("can't encode file struct");
    write_save_file(new_content);
}
