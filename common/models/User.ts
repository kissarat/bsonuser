import { PlainIdentityObject, Primitive } from "common/types"
import { createHash } from "crypto"

const salt = 'Ko2ahquaQu4veibee1aethu0quiyeeb9ahy5coo7aim9kei8'

export function hashPassword(password): Buffer {
    const hash = createHash('sha256')
    hash.update(salt)
    hash.update(password)
    return hash.digest()
}

export function isValidPassword(hash: Buffer, password: string): boolean {
    return hash.equals(hashPassword(password))
}

export type UserSearchable = 'email' | 'name' | 'id'

export class User implements PlainIdentityObject {
    id = 0;
    [key: string]: Primitive;
    
    protected passwordHash: Buffer
    constructor(
        public email: string,
        public name: string,
        public password: string,
        public id = 0
    ) {
    }
}
