import { Injectable, Logger, BadRequestException } from '@nestjs/common';

// ?��??�서 추출??직원 ?�보 ?�??
export type ExtractedEmployeeInfo = {
    NO: string;
    ?�명: string;
    ?�년?�일: number;
    직급: string;
    ?�번: number;
    부?�명: string;
    ?�사?? number;
};

// ?��??�서 추출???�메???�보 ?�??
export type ExtractedEmailInfo = {
    ?�원코드: string;
    ?�원�? string;
    EMAIL: string;
};

// 병합??직원 ?�보 ?�??
export type MergedEmployeeInfo = {
    employeeName: string;
    employeeNumber: string;
    birthDate: string;
    entryDate: string;
    email: string;
};

/**
 * 직원 ?��? 가?�오�??�메???�비??
 * - ?��? ?�일 처리 관???�심 ?�메??로직
 * - 직원 ?�보?� ?�메???�보 병합 로직
 */
@Injectable()
export class EmployeeExcelImportDomainService {
    private readonly logger = new Logger(EmployeeExcelImportDomainService.name);

    /**
     * 직원 ?�보?� ?�메???�보 병합
     */
    mergeEmployeeAndEmailInfo(
        employeeInfoList: ExtractedEmployeeInfo[],
        emailInfoList: ExtractedEmailInfo[],
    ): MergedEmployeeInfo[] {
        try {
            const mergedList = employeeInfoList
                .map((employeeInfo) => {
                    const emailInfo = emailInfoList.find(
                        (emailInfoItem) => emailInfoItem['?�원코드'] === employeeInfo['?�번'].toString(),
                    );

                    if (!emailInfo) {
                        this.logger.warn(`?�메?�이 존재?��? ?�는 직원: ${employeeInfo['?�번']}`);
                        return null;
                    }

                    return {
                        employeeName: employeeInfo['?�명'],
                        employeeNumber: employeeInfo['?�번'].toString(),
                        birthDate: this.excelDateToString(employeeInfo['?�년?�일']),
                        entryDate: this.excelDateToString(employeeInfo['?�사??]),
                        email: emailInfo['EMAIL'],
                    } as MergedEmployeeInfo;
                })
                .filter((item): item is MergedEmployeeInfo => item !== null);

            this.logger.log(`${mergedList.length}개의 직원 ?�보�?병합?�습?�다.`);
            return mergedList;
        } catch (error) {
            this.logger.error('직원 ?�보?� ?�메???�보 병합 ?�패', error.stack);
            throw new BadRequestException('직원 ?�보 병합 �??�류가 발생?�습?�다.');
        }
    }

    /**
     * ?��? ?�짜�?문자?�로 변??
     */
    excelDateToString(serial: number): string {
        try {
            if (typeof serial !== 'number') return serial;
            const utc_days = Math.floor(serial - 25569);
            const utc_value = utc_days * 86400;
            const date_info = new Date(utc_value * 1000);
            return date_info.toISOString().split('T')[0];
        } catch (error) {
            this.logger.error(`?��? ?�짜 변???�패: ${serial}`, error.stack);
            throw new BadRequestException('?�짜 변??�??�류가 발생?�습?�다.');
        }
    }

    /**
     * 직원 ?�보 ?�효??검�?
     */
    validateEmployeeInfo(employeeInfo: MergedEmployeeInfo): boolean {
        if (!employeeInfo.employeeName || !employeeInfo.employeeNumber || !employeeInfo.email) {
            this.logger.warn(`?�수 ?�보가 ?�락??직원: ${employeeInfo.employeeNumber}`);
            return false;
        }

        // ?�메???�식 검�?
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(employeeInfo.email)) {
            this.logger.warn(`?�못???�메???�식: ${employeeInfo.email}`);
            return false;
        }

        // ?�짜 ?�식 검�?
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (employeeInfo.birthDate && !dateRegex.test(employeeInfo.birthDate)) {
            this.logger.warn(`?�못???�년?�일 ?�식: ${employeeInfo.birthDate}`);
            return false;
        }

        if (employeeInfo.entryDate && !dateRegex.test(employeeInfo.entryDate)) {
            this.logger.warn(`?�못???�사???�식: ${employeeInfo.entryDate}`);
            return false;
        }

        return true;
    }

    /**
     * 직원 ?�보 ?�터�?(?�효???�보�?반환)
     */
    filterValidEmployeeInfo(employeeInfoList: MergedEmployeeInfo[]): MergedEmployeeInfo[] {
        const validList = employeeInfoList.filter((employeeInfo) => this.validateEmployeeInfo(employeeInfo));
        this.logger.log(`${validList.length}개의 ?�효??직원 ?�보�??�터링했?�니??`);
        return validList;
    }
}
