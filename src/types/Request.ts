// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface Request {
    url: string,
    method: string,
    body: string,
    bodyType: string,
    headers: Array<Array<string>>,
    queryParameters: Array<Array<string>>,
}

export interface RustRequest {
    url: string,
    method: string,
    body: string,
    bodyType: string,
    headers: Record<string, string>,
}

export interface SaveRequest {
    name: string,
    key: string,
    url: string,
    method: string,
    body: string,
    bodyType: string,
    headers: Record<string, string>,
    queryParameters: Record<string, string>,
}