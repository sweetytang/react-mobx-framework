import { makeObservable, computed } from "mobx";
import { RootStore } from "./RootStore";

export class BaseStore<T extends RootStore> {
    rootStore: T;
    
    constructor(root: T) {
        this.rootStore = root;
        makeObservable(this, {
            root: computed
        });
    }

    get root(): T {
        return this.rootStore;
    }
}