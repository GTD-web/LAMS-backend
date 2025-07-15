import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    readonly page: number;

    @ApiProperty({
        description: 'Number of items per page',
        example: 10,
    })
    readonly limit: number;

    @ApiProperty({
        description: 'Total number of items',
        example: 100,
    })
    readonly total: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 10,
    })
    readonly totalPages: number;

    constructor(page: number, limit: number, total: number) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.totalPages = Math.ceil(total / limit);
    }
}

export class PaginatedResponseDto<T> {
    @ApiProperty({
        description: 'Array of data items',
        type: 'array',
    })
    readonly data: T[];

    @ApiProperty({
        description: 'Pagination metadata',
        type: PaginationMetaDto,
    })
    readonly meta: PaginationMetaDto;

    constructor(data: T[], meta: PaginationMetaDto) {
        this.data = data;
        this.meta = meta;
    }

    static create<T>(data: T[], page: number, limit: number, total: number): PaginatedResponseDto<T> {
        const meta = new PaginationMetaDto(page, limit, total);
        return new PaginatedResponseDto(data, meta);
    }
}
