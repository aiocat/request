// Copyright (c) 2022 aiocat
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createApp } from "vue";
import Store from "./store";
import App from "./App.vue";
import { Totify } from "./notify/index"

Totify.init("RIGHT", "BOTTOM")
const app = createApp(App);
app.use(Store);
app.mount("#app");
