import { PageSize } from '../PageSize';

export class Page {
    constructor(
        public count = 0,
        public pageNumber = 1,
        public pageSize = PageSize.Ten
    ) {
    }

    get offset() {
        return this.pageSize * (this.pageNumber - 1)
    }
}
