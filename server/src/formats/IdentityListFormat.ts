import { PlainIdentityObject } from "common/types"
import { ListFormat } from "./ListFormat"

export class IdentityListFormat<T extends PlainIdentityObject> extends ListFormat<T> {
    static readonly formatUUID = '3d12cc82-faa2-4112-8456-ab7460518bea'
    public format = ListFormat.formatUUID
    public lastId = 0

    constructor(
        items: T[],
        time = new Date()
    ) {
        super(items, time)
        this.findLastId()
    }

    findLastId() {
        this.lastId = this.items.reduce((acc, item) => Math.max(acc, item.id), this.lastId)
        return this.lastId
    }

    serialize() {
        this.findLastId()
        return super.serialize()
    }
}
