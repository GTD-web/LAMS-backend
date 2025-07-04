export class CustomResponse<T> {
    constructor(
        public data: T,
        public message: string = 'Success',
    ) {}
}
