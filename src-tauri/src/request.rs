// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

use reqwest;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Struct for requests
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Request {
    url: String,
    method: String,
    body: String,
    body_type: String,
    headers: HashMap<String, String>,
}

// Struct for response
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Response {
    body: String,
    status: u16,
    headers: HashMap<String, String>,
}

#[tauri::command]
pub async fn send_request(request: Request) -> Response {
    let mut response: Option<reqwest::Response> = None;

    match request.method.as_str() {
        "GET" => response = Some(send_get_request(&request).await),
        "DELETE" => response = Some(send_delete_request(&request).await),
        "POST" => response = Some(send_post_request(&request).await),
        "PUT" => response = Some(send_put_request(&request).await),
        "PATCH" => response = Some(send_patch_request(&request).await),
        _ => panic!("unexcepted method"),
    }

    match response {
        Some(usable_response) => {
            let response_status = usable_response.status().as_u16();
            let mut response_headers: HashMap<String, String> = HashMap::new();
            for (key, value) in usable_response.headers() {
                response_headers.insert(key.to_string(), value.to_str().unwrap().to_owned());
            }
            let response_text = usable_response.text().await.unwrap_or(String::new());

            Response {
                body: response_text.to_string(),
                status: response_status,
                headers: response_headers,
            }
        }
        None => panic!("unaccessable code"),
    }
}

// send get request to url
async fn send_get_request(request: &Request) -> reqwest::Response {
    // prepare get request
    let mut client = reqwest::Client::new().get(&request.url);
    // add headers
    for (key, value) in &request.headers {
        client = client.header(key, value);
    }

    // send request
    client.send().await.unwrap()
}

// send delete request to url
async fn send_delete_request(request: &Request) -> reqwest::Response {
    // prepare delete request
    let mut client = reqwest::Client::new().delete(&request.url);
    // add headers
    for (key, value) in &request.headers {
        client = client.header(key, value);
    }

    // send request
    client.send().await.unwrap()
}

// send post request to url
async fn send_post_request(request: &Request) -> reqwest::Response {
    // prepare post request
    let mut client = reqwest::Client::new().post(&request.url);
    // add headers
    for (key, value) in &request.headers {
        client = client.header(key, value);
    }

    // set body and content type
    match request.body_type.as_str() {
        "Json" => {
            client = client
                .header("Content-Type", "application/json")
                .body(request.body.clone())
        }
        "Text" => client = client.body(request.body.clone()),
        "Bytes" => {
            client = client
                .header("Content-Type", "application/octet-stream")
                .body(request.body.clone())
        }
        _ => {}
    }

    // send request
    client.send().await.unwrap()
}

// send put request to url
async fn send_put_request(request: &Request) -> reqwest::Response {
    // prepare put request
    let mut client = reqwest::Client::new().put(&request.url);
    // add headers
    for (key, value) in &request.headers {
        client = client.header(key, value);
    }

    // set body and content type
    match request.body_type.as_str() {
        "Json" => {
            client = client
                .header("Content-Type", "application/json")
                .body(request.body.clone())
        }
        "Text" => client = client.body(request.body.clone()),
        "Bytes" => {
            client = client
                .header("Content-Type", "application/octet-stream")
                .body(request.body.clone())
        }
        _ => {}
    }

    // send request
    client.send().await.unwrap()
}

// send patch request to url
async fn send_patch_request(request: &Request) -> reqwest::Response {
    // prepare patch request
    let mut client = reqwest::Client::new().patch(&request.url);
    // add headers
    for (key, value) in &request.headers {
        client = client.header(key, value);
    }

    // set body and content type
    match request.body_type.as_str() {
        "Json" => {
            client = client
                .header("Content-Type", "application/json")
                .body(request.body.clone())
        }
        "Text" => client = client.body(request.body.clone()),
        "Bytes" => {
            client = client
                .header("Content-Type", "application/octet-stream")
                .body(request.body.clone())
        }
        _ => {}
    }

    // send request
    client.send().await.unwrap()
}
