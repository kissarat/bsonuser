export class Success<T> {
    constructor(
        public data?: T,
        public ok = 1
    ) { }
}
