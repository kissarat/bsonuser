import { InternalServerErrorException } from "@nestjs/common"
import { PlainObject } from "common/types"
import { Serialization } from "./serialization"

export class ListFormat<T extends PlainObject> {
    static formatUUID = '1440d64f-151a-4f20-a8b9-51c2cb1d91ab'
    public format = ListFormat.formatUUID
    public serializer = JSON

    constructor(
        public items: T[],
        public time = new Date()
    ) {}

    serialize() {
        return Serialization.serialize(this)
    }

    static deserialize<T extends PlainObject, TReturn extends ListFormat<T> = ListFormat<T>>(buffer): TReturn {
        const pkg = Serialization.deserialize(buffer) as TReturn
        if (this.formatUUID !== pkg.format) {
            throw new InternalServerErrorException(`Invalid format ${pkg.format}`)
        }
        if (this.constructor.prototype) {
            Object.setPrototypeOf(pkg, this.constructor.prototype)
        }
        return pkg
    }
}
