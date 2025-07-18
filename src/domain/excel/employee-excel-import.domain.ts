import { Injectable, Logger, BadRequestException } from '@nestjs/common';

// ?‘ì??ì„œ ì¶”ì¶œ??ì§ì› ?•ë³´ ?€??
export type ExtractedEmployeeInfo = {
    NO: string;
    ?±ëª…: string;
    ?ë…„?”ì¼: number;
    ì§ê¸‰: string;
    ?¬ë²ˆ: number;
    ë¶€?œëª…: string;
    ?…ì‚¬?? number;
};

// ?‘ì??ì„œ ì¶”ì¶œ???´ë©”???•ë³´ ?€??
export type ExtractedEmailInfo = {
    ?¬ì›ì½”ë“œ: string;
    ?¬ì›ëª? string;
    EMAIL: string;
};

// ë³‘í•©??ì§ì› ?•ë³´ ?€??
export type MergedEmployeeInfo = {
    employeeName: string;
    employeeNumber: string;
    birthDate: string;
    entryDate: string;
    email: string;
};

/**
 * ì§ì› ?‘ì? ê°€?¸ì˜¤ê¸??„ë©”???œë¹„??
 * - ?‘ì? ?Œì¼ ì²˜ë¦¬ ê´€???µì‹¬ ?„ë©”??ë¡œì§
 * - ì§ì› ?•ë³´?€ ?´ë©”???•ë³´ ë³‘í•© ë¡œì§
 */
@Injectable()
export class EmployeeExcelImportDomainService {
    private readonly logger = new Logger(EmployeeExcelImportDomainService.name);

    /**
     * ì§ì› ?•ë³´?€ ?´ë©”???•ë³´ ë³‘í•©
     */
    mergeEmployeeAndEmailInfo(
        employeeInfoList: ExtractedEmployeeInfo[],
        emailInfoList: ExtractedEmailInfo[],
    ): MergedEmployeeInfo[] {
        try {
            const mergedList = employeeInfoList
                .map((employeeInfo) => {
                    const emailInfo = emailInfoList.find(
                        (emailInfoItem) => emailInfoItem['?¬ì›ì½”ë“œ'] === employeeInfo['?¬ë²ˆ'].toString(),
                    );

                    if (!emailInfo) {
                        this.logger.warn(`?´ë©”?¼ì´ ì¡´ì¬?˜ì? ?ŠëŠ” ì§ì›: ${employeeInfo['?¬ë²ˆ']}`);
                        return null;
                    }

                    return {
                        employeeName: employeeInfo['?±ëª…'],
                        employeeNumber: employeeInfo['?¬ë²ˆ'].toString(),
                        birthDate: this.excelDateToString(employeeInfo['?ë…„?”ì¼']),
                        entryDate: this.excelDateToString(employeeInfo['?…ì‚¬??]),
                        email: emailInfo['EMAIL'],
                    } as MergedEmployeeInfo;
                })
                .filter((item): item is MergedEmployeeInfo => item !== null);

            this.logger.log(`${mergedList.length}ê°œì˜ ì§ì› ?•ë³´ë¥?ë³‘í•©?ˆìŠµ?ˆë‹¤.`);
            return mergedList;
        } catch (error) {
            this.logger.error('ì§ì› ?•ë³´?€ ?´ë©”???•ë³´ ë³‘í•© ?¤íŒ¨', error.stack);
            throw new BadRequestException('ì§ì› ?•ë³´ ë³‘í•© ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
        }
    }

    /**
     * ?‘ì? ? ì§œë¥?ë¬¸ì?´ë¡œ ë³€??
     */
    excelDateToString(serial: number): string {
        try {
            if (typeof serial !== 'number') return serial;
            const utc_days = Math.floor(serial - 25569);
            const utc_value = utc_days * 86400;
            const date_info = new Date(utc_value * 1000);
            return date_info.toISOString().split('T')[0];
        } catch (error) {
            this.logger.error(`?‘ì? ? ì§œ ë³€???¤íŒ¨: ${serial}`, error.stack);
            throw new BadRequestException('? ì§œ ë³€??ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤.');
        }
    }

    /**
     * ì§ì› ?•ë³´ ? íš¨??ê²€ì¦?
     */
    validateEmployeeInfo(employeeInfo: MergedEmployeeInfo): boolean {
        if (!employeeInfo.employeeName || !employeeInfo.employeeNumber || !employeeInfo.email) {
            this.logger.warn(`?„ìˆ˜ ?•ë³´ê°€ ?„ë½??ì§ì›: ${employeeInfo.employeeNumber}`);
            return false;
        }

        // ?´ë©”???•ì‹ ê²€ì¦?
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(employeeInfo.email)) {
            this.logger.warn(`?˜ëª»???´ë©”???•ì‹: ${employeeInfo.email}`);
            return false;
        }

        // ? ì§œ ?•ì‹ ê²€ì¦?
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (employeeInfo.birthDate && !dateRegex.test(employeeInfo.birthDate)) {
            this.logger.warn(`?˜ëª»???ë…„?”ì¼ ?•ì‹: ${employeeInfo.birthDate}`);
            return false;
        }

        if (employeeInfo.entryDate && !dateRegex.test(employeeInfo.entryDate)) {
            this.logger.warn(`?˜ëª»???…ì‚¬???•ì‹: ${employeeInfo.entryDate}`);
            return false;
        }

        return true;
    }

    /**
     * ì§ì› ?•ë³´ ?„í„°ë§?(? íš¨???•ë³´ë§?ë°˜í™˜)
     */
    filterValidEmployeeInfo(employeeInfoList: MergedEmployeeInfo[]): MergedEmployeeInfo[] {
        const validList = employeeInfoList.filter((employeeInfo) => this.validateEmployeeInfo(employeeInfo));
        this.logger.log(`${validList.length}ê°œì˜ ? íš¨??ì§ì› ?•ë³´ë¥??„í„°ë§í–ˆ?µë‹ˆ??`);
        return validList;
    }
}
