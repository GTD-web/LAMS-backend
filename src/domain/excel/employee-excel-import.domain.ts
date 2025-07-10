import { Injectable, Logger, BadRequestException } from '@nestjs/common';

// 엑셀에서 추출된 직원 정보 타입
export type ExtractedEmployeeInfo = {
    NO: string;
    성명: string;
    생년월일: number;
    직급: string;
    사번: number;
    부서명: string;
    입사일: number;
};

// 엑셀에서 추출된 이메일 정보 타입
export type ExtractedEmailInfo = {
    사원코드: string;
    사원명: string;
    EMAIL: string;
};

// 병합된 직원 정보 타입
export type MergedEmployeeInfo = {
    employeeName: string;
    employeeNumber: string;
    birthDate: string;
    entryDate: string;
    email: string;
};

/**
 * 직원 엑셀 가져오기 도메인 서비스
 * - 엑셀 파일 처리 관련 핵심 도메인 로직
 * - 직원 정보와 이메일 정보 병합 로직
 */
@Injectable()
export class EmployeeExcelImportDomainService {
    private readonly logger = new Logger(EmployeeExcelImportDomainService.name);

    /**
     * 직원 정보와 이메일 정보 병합
     */
    mergeEmployeeAndEmailInfo(
        employeeInfoList: ExtractedEmployeeInfo[],
        emailInfoList: ExtractedEmailInfo[],
    ): MergedEmployeeInfo[] {
        try {
            const mergedList = employeeInfoList
                .map((employeeInfo) => {
                    const emailInfo = emailInfoList.find(
                        (emailInfoItem) => emailInfoItem['사원코드'] === employeeInfo['사번'].toString(),
                    );

                    if (!emailInfo) {
                        this.logger.warn(`이메일이 존재하지 않는 직원: ${employeeInfo['사번']}`);
                        return null;
                    }

                    return {
                        employeeName: employeeInfo['성명'],
                        employeeNumber: employeeInfo['사번'].toString(),
                        birthDate: this.excelDateToString(employeeInfo['생년월일']),
                        entryDate: this.excelDateToString(employeeInfo['입사일']),
                        email: emailInfo['EMAIL'],
                    } as MergedEmployeeInfo;
                })
                .filter((item): item is MergedEmployeeInfo => item !== null);

            this.logger.log(`${mergedList.length}개의 직원 정보를 병합했습니다.`);
            return mergedList;
        } catch (error) {
            this.logger.error('직원 정보와 이메일 정보 병합 실패', error.stack);
            throw new BadRequestException('직원 정보 병합 중 오류가 발생했습니다.');
        }
    }

    /**
     * 엑셀 날짜를 문자열로 변환
     */
    excelDateToString(serial: number): string {
        try {
            if (typeof serial !== 'number') return serial;
            const utc_days = Math.floor(serial - 25569);
            const utc_value = utc_days * 86400;
            const date_info = new Date(utc_value * 1000);
            return date_info.toISOString().split('T')[0];
        } catch (error) {
            this.logger.error(`엑셀 날짜 변환 실패: ${serial}`, error.stack);
            throw new BadRequestException('날짜 변환 중 오류가 발생했습니다.');
        }
    }

    /**
     * 직원 정보 유효성 검증
     */
    validateEmployeeInfo(employeeInfo: MergedEmployeeInfo): boolean {
        if (!employeeInfo.employeeName || !employeeInfo.employeeNumber || !employeeInfo.email) {
            this.logger.warn(`필수 정보가 누락된 직원: ${employeeInfo.employeeNumber}`);
            return false;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(employeeInfo.email)) {
            this.logger.warn(`잘못된 이메일 형식: ${employeeInfo.email}`);
            return false;
        }

        // 날짜 형식 검증
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (employeeInfo.birthDate && !dateRegex.test(employeeInfo.birthDate)) {
            this.logger.warn(`잘못된 생년월일 형식: ${employeeInfo.birthDate}`);
            return false;
        }

        if (employeeInfo.entryDate && !dateRegex.test(employeeInfo.entryDate)) {
            this.logger.warn(`잘못된 입사일 형식: ${employeeInfo.entryDate}`);
            return false;
        }

        return true;
    }

    /**
     * 직원 정보 필터링 (유효한 정보만 반환)
     */
    filterValidEmployeeInfo(employeeInfoList: MergedEmployeeInfo[]): MergedEmployeeInfo[] {
        const validList = employeeInfoList.filter((employeeInfo) => this.validateEmployeeInfo(employeeInfo));
        this.logger.log(`${validList.length}개의 유효한 직원 정보를 필터링했습니다.`);
        return validList;
    }
}
