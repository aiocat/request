// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface Request extends Record<string, any> {
    url: string,
    method: string,
    body: string,
    bodyType: string,
    headers: Array<Array<string>>,
    queryParameters: Array<Array<string>>,
}

export interface RustRequest extends Record<string, any> {
    url: string,
    method: string,
    body: string,
    bodyType: string,
    headers: Record<string, string>,
}

export interface SaveRequest extends Record<string, any> {
    name: string,
    key: string,
    url: string,
    method: string,
    body: string,
    bodyType: string,
    headers: Record<string, string>,
    queryParameters: Record<string, string>,
}