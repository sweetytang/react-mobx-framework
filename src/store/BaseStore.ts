import { RootStore } from "./RootStore";

export class BaseStore<T extends RootStore> {
    rootStore: T;
    constructor(root: T) {
        this.rootStore = root;
    }

    get root(): T {
        return this.rootStore;
    }
}