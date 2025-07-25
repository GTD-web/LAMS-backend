import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

/**
 * 휴일 API 연동 도메인 서비스
 * - 외부 공휴일 API와의 연동을 담당
 * - 공휴일 데이터 조회 및 변환 처리
 */
@Injectable()
export class HolidayApiService {
    private readonly logger = new Logger(HolidayApiService.name);

    /**
     * 특정 연도/월의 공휴일 데이터를 외부 API에서 조회
     */
    async fetchHolidaysFromApi(year: string, month: string): Promise<any[]> {
        const url = process.env.HOLIDAY_API_URL;

        if (!url || !process.env.HOLIDAY_API_KEY) {
            this.logger.error('휴일 API URL 또는 API KEY가 설정되지 않았습니다.');
            return [];
        }

        let queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + process.env.HOLIDAY_API_KEY;
        queryParams += '&' + encodeURIComponent('solYear') + '=' + encodeURIComponent(year);
        queryParams += '&' + encodeURIComponent('solMonth') + '=' + encodeURIComponent(month);

        try {
            this.logger.debug(`휴일 API 호출: ${year}-${month}`);
            const axiosResponse = await axios.get(url + queryParams);
            const result = axiosResponse.data.response.body.items;

            if (result && result.item) {
                const holidays = Array.isArray(result.item) ? result.item : [result.item];
                this.logger.debug(`${year}-${month} 휴일 ${holidays.length}개 조회 완료`);
                return holidays;
            }

            this.logger.debug(`${year}-${month} 휴일 없음`);
            return [];
        } catch (error) {
            this.logger.error(`휴일 API 호출 실패 ${year}-${month}:`, error.message);
            return [];
        }
    }

    /**
     * 연도별 전체 공휴일 데이터 조회 (1월~12월)
     */
    async fetchYearlyHolidays(year: string): Promise<any[]> {
        const allHolidays: any[] = [];

        // 1월 ~ 12월까지 휴일을 조회
        for (let month = 1; month <= 12; month++) {
            const monthStr = month.toString().padStart(2, '0');
            const monthlyHolidays = await this.fetchHolidaysFromApi(year, monthStr);
            allHolidays.push(...monthlyHolidays);
        }

        this.logger.log(`${year}년 전체 휴일 ${allHolidays.length}개 조회 완료`);
        return allHolidays;
    }

    /**
     * 휴일 데이터 형식 변환 (yyyymmdd → yyyy-mm-dd)
     */
    formatHolidayData(holidays: any[]): Array<{ holidayDate: string; holidayName: string }> {
        return holidays.map((holiday) => {
            const locdate = holiday.locdate.toString();
            const formattedDate = `${locdate.slice(0, 4)}-${locdate.slice(4, 6)}-${locdate.slice(6, 8)}`;

            return {
                holidayDate: formattedDate,
                holidayName: holiday.dateName,
            };
        });
    }
}
