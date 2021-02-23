export type Identity = string | number | Buffer
export type Primitive = Identity | boolean | null
export interface StrictObject<TValue = any> { [key: string]: TValue }
export type PlainObject = StrictObject<Primitive>
export interface PlainIdentityObject<TId extends Identity = number> extends PlainObject { id: TId }
