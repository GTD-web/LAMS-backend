import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceTypeEntity } from '../entities/attendance-type.entity';
import { Cron } from '@nestjs/schedule';

/**
 * 근무 유형 시드 도메인 서비스
 * - 근무 유형 기본 데이터 초기화
 * - 시스템 시작 시 필수 근무 유형 데이터 생성
 */
@Injectable()
export class AttendanceTypeSeedService {
    private readonly logger = new Logger(AttendanceTypeSeedService.name);

    constructor(
        @InjectRepository(AttendanceTypeEntity)
        private readonly attendanceTypeRepository: Repository<AttendanceTypeEntity>,
    ) {}

    /**
     * 기본 근무 유형 데이터 시드
     */
    @Cron('0 0 0 1 1 *')
    async seedDefaultAttendanceTypes(): Promise<void> {
        this.logger.log('근무 유형 시드 데이터 초기화 시작');

        const attendanceTypes = this.getDefaultAttendanceTypes();
        let createdCount = 0;

        for (const typeData of attendanceTypes) {
            try {
                const existingType = await this.attendanceTypeRepository.findOne({
                    where: { title: typeData.title },
                });

                if (existingType) {
                    continue;
                }

                const processedType = this.processAttendanceTypeData(typeData);
                const newAttendanceType = this.attendanceTypeRepository.create(processedType);
                const savedType = await this.attendanceTypeRepository.save(newAttendanceType);

                this.logger.debug(`근무 유형 생성: ${savedType.title}`);
                createdCount++;
            } catch (error) {
                this.logger.error(`근무 유형 생성 실패: ${typeData.title}`, error.stack);
            }
        }

        this.logger.log(`근무 유형 시드 완료 - 생성: ${createdCount}개`);
    }

    /**
     * 기본 근무 유형 데이터 정의
     */
    private getDefaultAttendanceTypes(): Partial<AttendanceTypeEntity>[] {
        return [
            { title: '연차', workTime: 8, isRecognizedWorkTime: true, deductedAnnualLeave: 1 },
            { title: '오전반차', workTime: 4, isRecognizedWorkTime: true, deductedAnnualLeave: 0.5 },
            { title: '오후반차', workTime: 4, isRecognizedWorkTime: true, deductedAnnualLeave: 0.5 },
            { title: '공가', workTime: 8, isRecognizedWorkTime: true },
            { title: '오전공가', workTime: 4, isRecognizedWorkTime: true },
            { title: '오후공가', workTime: 4, isRecognizedWorkTime: true },
            { title: '출장', workTime: 8, isRecognizedWorkTime: true },
            { title: '오전출장', workTime: 4, isRecognizedWorkTime: true },
            { title: '오후출장', workTime: 4, isRecognizedWorkTime: true },
            { title: '교육', workTime: 8, isRecognizedWorkTime: true },
            { title: '오전교육', workTime: 4, isRecognizedWorkTime: true },
            { title: '오후교육', workTime: 4, isRecognizedWorkTime: true },
            { title: '경조휴가', workTime: 8, isRecognizedWorkTime: true },
            { title: '보건휴가(오전반차)', workTime: 4, isRecognizedWorkTime: true },
            { title: '병가', workTime: 8, isRecognizedWorkTime: true },
            { title: '생일오전반차', workTime: 4, isRecognizedWorkTime: true, deductedAnnualLeave: 0.5 },
            { title: '생일오후반차', workTime: 4, isRecognizedWorkTime: true, deductedAnnualLeave: 0.5 },
            { title: '대체휴가', workTime: 8, isRecognizedWorkTime: true },
            { title: '오전대체휴가', workTime: 4, isRecognizedWorkTime: true },
            { title: '오후대체휴가', workTime: 4, isRecognizedWorkTime: true },
            { title: '무급병가', workTime: 0, isRecognizedWorkTime: true },
            { title: '무급휴가', workTime: 0, isRecognizedWorkTime: true },
            { title: '국내출장', workTime: 8, isRecognizedWorkTime: true },
            { title: '국외출장', workTime: 8, isRecognizedWorkTime: true },
            { title: '사외교육', workTime: 8, isRecognizedWorkTime: true },
            { title: '사내교육', workTime: 8, isRecognizedWorkTime: true },
        ];
    }

    /**
     * 근무 유형 데이터 가공 (시작/종료 시간 설정)
     */
    private processAttendanceTypeData(typeData: Partial<AttendanceTypeEntity>): Partial<AttendanceTypeEntity> {
        const processedData = { ...typeData };

        // 기본값 설정
        if (processedData.deductedAnnualLeave === undefined) {
            processedData.deductedAnnualLeave = 0;
        }

        // 시작/종료 시간 설정
        if (typeData.title?.includes('오전')) {
            processedData.startWorkTime = '09:00';
            processedData.endWorkTime = '14:00';
        } else if (typeData.title?.includes('오후')) {
            processedData.startWorkTime = '14:00';
            processedData.endWorkTime = '18:00';
        } else {
            processedData.startWorkTime = '09:00';
            processedData.endWorkTime = '18:00';
        }

        return processedData;
    }

    /**
     * 특정 근무 유형이 존재하는지 확인
     */
    async isAttendanceTypeExists(title: string): Promise<boolean> {
        const existingType = await this.attendanceTypeRepository.findOne({
            where: { title },
        });
        return !!existingType;
    }

    /**
     * 모든 근무 유형 개수 조회
     */
    async getAttendanceTypeCount(): Promise<number> {
        return await this.attendanceTypeRepository.count();
    }

    /**
     * 시드 데이터 재초기화 (기존 데이터 삭제 후 재생성)
     */
    async resetAttendanceTypeSeeds(): Promise<void> {
        this.logger.warn('근무 유형 시드 데이터 재초기화 시작');

        // 기존 데이터 삭제
        await this.attendanceTypeRepository.clear();
        this.logger.log('기존 근무 유형 데이터 삭제 완료');

        // 새 데이터 생성
        await this.seedDefaultAttendanceTypes();

        this.logger.log('근무 유형 시드 데이터 재초기화 완료');
    }
}
