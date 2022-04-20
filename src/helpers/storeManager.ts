// Copyright (c) 2022 aiocat
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useStore, Store } from "vuex";
import { computed } from "vue";

export class StoreManager {
    public store: Store<any>;

    public constructor() {
        this.store = useStore()
    }

    public getState(name: string): any {
        return computed(() => this.store.state[name])
    }
}