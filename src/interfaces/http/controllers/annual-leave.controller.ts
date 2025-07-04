import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CreateAnnualLeaveDto } from '../dtos/annual-leave/requests/create-annual-leave.dto';
import { UpdateAnnualLeaveDto } from '../dtos/annual-leave/requests/update-annual-leave.dto';
import { AnnualLeaveResponseDto } from '../dtos/annual-leave/responses/annual-leave.response.dto';
import { ErrorResponseDto } from '@src/shared/dtos/common/error-response.dto';

@ApiTags('annual-leave')
@Controller({ path: 'annual-leave', version: '1' })
@ApiBearerAuth('JWT-auth')
export class AnnualLeaveController {
    constructor() {} // Inject use cases here

    @Post()
    @ApiOperation({
        summary: 'Create annual leave',
        description: 'Creates a new annual leave record for an employee',
    })
    @ApiBody({
        type: CreateAnnualLeaveDto,
        description: 'Annual leave creation data',
    })
    @ApiCreatedResponse({
        description: 'Annual leave successfully created',
        type: AnnualLeaveResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Authentication required',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Access denied',
        type: ErrorResponseDto,
    })
    @ApiConflictResponse({
        description: 'Annual leave already exists for this period',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: ErrorResponseDto,
    })
    async createAnnualLeave(
        @Body() dto: CreateAnnualLeaveDto,
    ): Promise<AnnualLeaveResponseDto> {
        // TODO: Implement use case
        throw new Error('Not implemented');
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get annual leave by ID',
        description:
            'Retrieves a specific annual leave record by its unique identifier',
    })
    @ApiParam({
        name: 'id',
        description: 'Annual leave unique identifier',
        type: 'string',
        format: 'uuid',
        example: 'uuid-v4-string',
    })
    @ApiOkResponse({
        description: 'Annual leave found and returned',
        type: AnnualLeaveResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Authentication required',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Access denied',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Annual leave not found',
        type: ErrorResponseDto,
    })
    async getAnnualLeaveById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<AnnualLeaveResponseDto> {
        // TODO: Implement use case
        throw new Error('Not implemented');
    }

    @Get()
    @ApiOperation({
        summary: 'Get annual leaves list',
        description:
            'Retrieves a paginated list of annual leaves with optional filtering',
    })
    @ApiQuery({
        name: 'page',
        description: 'Page number (1-based)',
        type: 'integer',
        example: 1,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: 'Number of items per page',
        type: 'integer',
        example: 10,
        required: false,
    })
    @ApiQuery({
        name: 'employeeId',
        description: 'Filter by employee ID',
        type: 'string',
        required: false,
    })
    @ApiQuery({
        name: 'year',
        description: 'Filter by year',
        type: 'integer',
        example: 2024,
        required: false,
    })
    @ApiOkResponse({
        description: 'Annual leaves list retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/AnnualLeaveResponseDto',
                    },
                },
                meta: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        total: { type: 'integer', example: 100 },
                        totalPages: { type: 'integer', example: 10 },
                    },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authentication required',
        type: ErrorResponseDto,
    })
    async getAnnualLeaves(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('employeeId') employeeId?: string,
        @Query('year') year?: number,
    ): Promise<any> {
        // TODO: Implement use case
        throw new Error('Not implemented');
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update annual leave',
        description: 'Updates an existing annual leave record',
    })
    @ApiParam({
        name: 'id',
        description: 'Annual leave unique identifier',
        type: 'string',
        format: 'uuid',
    })
    @ApiBody({
        type: UpdateAnnualLeaveDto,
        description: 'Annual leave update data',
    })
    @ApiOkResponse({
        description: 'Annual leave successfully updated',
        type: AnnualLeaveResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Authentication required',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Access denied',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Annual leave not found',
        type: ErrorResponseDto,
    })
    async updateAnnualLeave(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAnnualLeaveDto,
    ): Promise<AnnualLeaveResponseDto> {
        // TODO: Implement use case
        throw new Error('Not implemented');
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete annual leave',
        description: 'Deletes an annual leave record',
    })
    @ApiParam({
        name: 'id',
        description: 'Annual leave unique identifier',
        type: 'string',
        format: 'uuid',
    })
    @ApiOkResponse({
        description: 'Annual leave successfully deleted',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Annual leave deleted successfully',
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'Authentication required',
        type: ErrorResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Access denied',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Annual leave not found',
        type: ErrorResponseDto,
    })
    async deleteAnnualLeave(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ message: string }> {
        // TODO: Implement use case
        throw new Error('Not implemented');
    }
}
