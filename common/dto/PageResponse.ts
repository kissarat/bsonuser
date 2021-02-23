import { PageSize } from '../PageSize';
import { PlainObject } from '../types';
import { Page } from './Page';

export class PageResponse<T extends PlainObject> extends Page {
    constructor(
        public data: T[],
        public count = data.length,
        public pageNumber = 1,
        public pageSize = data.length,
        public ok = 1,
    ) {
        super(count, pageNumber, pageSize)
    }

    get offset() {
        return this.pageSize * (this.pageNumber - 1)
    }
}
