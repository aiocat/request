<div align="center">

![Logo](/public/logo.png)

# Request

Open-source api development application for minimalists, with new front-end.

## Screenshots

![s1](/screenshots/ss1.png)
![s2](/screenshots/ss2.png)
![s3](/screenshots/ss3.png)
![s4](/screenshots/ss4.png)
![s5](/screenshots/ss5.png)

</div>

## Why?

Lots of postman (like) program already exists. But they are really confusing and they have lots of feature we don't need.

Since CLI is not for everyone, I made request, http client for minimalists.

## Translation

If you want to add your language, go to [this](https://github.com/aiocat/request-i18n) repository and add your language based on `en.json`.


Languages are not limited to countries, You can add other languages (like pirate, pig latin etc...)


Don't forget to change [select box](https://github.com/aiocat/request/blob/main/src/components/Settings.vue#L13) or users can't use your language.

## Technologies

- [Tauri](https://tauri.studio/)
- [Vite Vue3 + TypeScript](https://vitejs.dev/)

## Building

### Pre-requests

- Rust
- Node
- OS specific build tooling, eg. `build-essential`, `xcode-select` or `C++ build tools`

### Progress

Clone the repo and:

- `npm install`
- `npm run tauri build`

## Download

Download request from [github releases](https://github.com/aiocat/request/releases/latest) page.

- **Current Version**: `v1.0.0`

## License

Request is distributed under MIT license. for more information:

- https://raw.githubusercontent.com/aiocat/request/main/LICENSE
