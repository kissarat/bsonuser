import { promises } from 'fs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlainIdentityObject, Primitive } from 'common/types';
import { IdentityListFormat } from './formats/IdentityListFormat';

@Injectable()
export class StorageService<
    T extends PlainIdentityObject = PlainIdentityObject,
    TSearchable extends keyof T = keyof T
    > {
    protected lastId = 0
    protected filename = 'items.bson';
    protected items: T[] | null = null;
    protected retreivedAt = 0;
    protected expiresIn = 0;
    protected isMutable = true;
    protected enumerate = true;

    isExpired(now = Date.now()): boolean {
        return this.expiresIn > 0 && now - this.retreivedAt > this.expiresIn
    }

    async load(): Promise<T[]> {
        try {
            const now = Date.now()
            if (!this.items || this.isExpired(now)) {
                const buffer = await promises.readFile(this.filename)
                const listFormat = IdentityListFormat.deserialize<T, IdentityListFormat<T>>(buffer)
                this.lastId = listFormat.lastId
                this.items = listFormat.items
            }
            this.retreivedAt = now
            return this.items
        } catch (err) {
            console.error(err)
            return null
            // throw err
        }
    }

    async save(items = this.items) {
        let old = this.items
        try {
            this.items = items
            await promises.writeFile(
                this.filename,
                new IdentityListFormat(items).serialize()
            )
            this.retreivedAt = Date.now()
        } catch (err) {
            this.items = old
            throw err
        }
    }

    async clear() {
        return this.save([])
    }

    async add(...newItems: T[]) {
        const items = await this.load()
        let enumeratedItems: T[]
        if (this.enumerate) {
            let id = items.length > 0 ? items[0].id : 0
            id = items.reduce((acc, item) => Math.max(item.id, acc), id)
            if (!(id > 0)) {
                throw new InternalServerErrorException('Invalid id')
            }
            enumeratedItems = newItems.map(item => {
                if (item.id > 0) {
                    return item
                }
                id++
                if (this.isMutable) {
                    item.id = id
                    return item
                }
                return {
                    ...item,
                    id
                }
            })
            this.lastId = id
        } else {
            enumeratedItems = newItems
        }
        items.push(...enumeratedItems)
        await this.save()
        return enumeratedItems
    }

    async findBy(propertyName: TSearchable, value: Primitive) {
        const items = await this.load()
        return items.filter(item => value === item[propertyName])
    }

    async removeBy(propertyName: TSearchable, value: Primitive) {
        let items = await this.load()
        const count = items.length
        items = items.filter(item => value === item[propertyName])
        const modified = items.length - count
        if (modified) {
            await this.save(items)
        }
        return modified
    }

    async updateBy(propertyName: TSearchable, value: Primitive, changes: Partial<T>) {
        const items = await this.load()
        const updatedList = items
            .filter(item => item[propertyName] === value)
            .map((item, i) => {
                if (this.isMutable) {
                    Object.assign(item, changes)
                    return item
                }
                const updated = {
                    ...item,
                    ...changes
                }
                items[i] = updated
                return updated
            })
        return updatedList
    }
}
