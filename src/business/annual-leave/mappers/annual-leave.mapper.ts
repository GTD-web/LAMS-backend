import { EmployeeAnnualLeaveEntity } from '../../../domain/annual-leave/entities/employee-annual-leave.entity';
import { CreateAnnualLeaveDto } from '../../../interfaces/http/dtos/annual-leave/requests/create-annual-leave.dto';
import { UpdateAnnualLeaveDto } from '../../../interfaces/http/dtos/annual-leave/requests/update-annual-leave.dto';
import { AnnualLeaveResponseDto } from '../../../interfaces/http/dtos/annual-leave/responses/annual-leave.response.dto';

export class AnnualLeaveMapper {
    static toEntity(dto: CreateAnnualLeaveDto): Partial<EmployeeAnnualLeaveEntity> {
        return {
            year: dto.year,
            fiscalYearTotalLeave: dto.totalDays,
            currentFiscalYearLeave: dto.totalDays,
            entryDateBasedTotalLeave: dto.totalDays,
            usedAnnualLeave: dto.usedDays || 0,
            remainedAnnualLeave: dto.remainingDays || dto.totalDays - (dto.usedDays || 0),
            note: dto.notes,
        };
    }

    static toUpdateEntity(dto: UpdateAnnualLeaveDto): Partial<EmployeeAnnualLeaveEntity> {
        const updateData: Partial<EmployeeAnnualLeaveEntity> = {};

        if (dto.totalDays !== undefined) {
            updateData.fiscalYearTotalLeave = dto.totalDays;
            updateData.currentFiscalYearLeave = dto.totalDays;
            updateData.entryDateBasedTotalLeave = dto.totalDays;
        }

        if (dto.usedDays !== undefined) {
            updateData.usedAnnualLeave = dto.usedDays;
        }

        if (dto.remainingDays !== undefined) {
            updateData.remainedAnnualLeave = dto.remainingDays;
        }

        if (dto.notes !== undefined) {
            updateData.note = dto.notes;
        }

        return updateData;
    }

    static toResponseDto(entity: EmployeeAnnualLeaveEntity): AnnualLeaveResponseDto {
        return new AnnualLeaveResponseDto({
            id: entity.annualLeaveId,
            employeeId: entity.employee?.employeeId || '',
            year: entity.year,
            totalDays: entity.fiscalYearTotalLeave,
            usedDays: entity.usedAnnualLeave,
            remainingDays: entity.remainedAnnualLeave,
            entryDate: new Date(entity.employee?.entryAt) || undefined,
            notes: entity.note,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toResponseDtoList(entities: EmployeeAnnualLeaveEntity[]): AnnualLeaveResponseDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }

    static calculateRemainingDays(totalDays: number, usedDays: number): number {
        return Math.max(0, totalDays - usedDays);
    }

    static validateAnnualLeaveData(dto: CreateAnnualLeaveDto | UpdateAnnualLeaveDto): void {
        if ('totalDays' in dto && 'usedDays' in dto) {
            const totalDays = dto.totalDays || 0;
            const usedDays = dto.usedDays || 0;

            if (usedDays > totalDays) {
                throw new Error('Used days cannot exceed total days');
            }
        }
    }
}
