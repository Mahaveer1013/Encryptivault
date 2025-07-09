export default class MasterKey {
    private keys: Map<string, string> = new Map();

    addKey(folderId: string, key: string) {
        this.keys.set(folderId, key);
    }

    removeKey(folderId: string) {
        this.keys.delete(folderId);
    }

    getKey(folderId: string) {
        return this.keys.get(folderId);
    }

    hasKey(folderId: string) {
        return this.keys.has(folderId);
    }

    removeAllKeys() {
        this.keys = new Map();
    }

}
