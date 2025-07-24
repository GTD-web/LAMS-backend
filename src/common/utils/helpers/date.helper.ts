import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 플러그인 즉시 로드
dayjs.extend(utc);
dayjs.extend(timezone);

// 기본 타임존 설정
dayjs.tz.setDefault('Asia/Seoul');

/**
 * 날짜 포맷 헬퍼 클래스
 * - dayjs를 사용한 일관된 날짜 처리
 * - 한국 시간대 기준 처리
 * - 다양한 포맷 지원
 */
export class DateHelper {
    // 기본 시간대 설정
    private static readonly DEFAULT_TIMEZONE = 'Asia/Seoul';

    // 자주 사용하는 포맷 상수
    static readonly FORMATS = {
        ISO_STRING: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
        ISO_DATE: 'YYYY-MM-DD',
        ISO_TIME: 'HH:mm:ss',
        ISO_DATETIME: 'YYYY-MM-DD HH:mm:ss',
        KOREAN_DATE: 'YYYY년 MM월 DD일',
        KOREAN_DATETIME: 'YYYY년 MM월 DD일 HH시 mm분',
        KOREAN_FULL: 'YYYY년 MM월 DD일 HH시 mm분 ss초',
        DISPLAY_DATE: 'YYYY.MM.DD',
        DISPLAY_DATETIME: 'YYYY.MM.DD HH:mm',
        MONTH_YEAR: 'YYYY-MM',
        YEAR: 'YYYY',
        MONTH: 'MM',
        DAY: 'DD',
        HOUR: 'HH',
        MINUTE: 'mm',
        SECOND: 'ss',
    } as const;

    /**
     * 현재 시간을 ISO 문자열로 반환
     */
    static now(): string {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_STRING);
    }

    /**
     * 현재 날짜를 ISO 날짜 형식으로 반환
     */
    static today(): string {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATE);
    }

    /**
     * 현재 시간을 ISO 시간 형식으로 반환
     */
    static currentTime(): string {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_TIME);
    }

    /**
     * 현재 날짜와 시간을 ISO 날짜시간 형식으로 반환
     */
    static nowDateTime(): string {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATETIME);
    }

    /**
     * 날짜를 지정된 포맷으로 변환
     */
    static format(date: Date | string | number, format: string = this.FORMATS.ISO_STRING): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(format);
    }

    /**
     * 날짜를 ISO 문자열로 변환
     */
    static toISOString(date: Date | string | number): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_STRING);
    }

    /**
     * 날짜를 ISO 날짜 형식으로 변환
     */
    static toISODate(date: Date | string | number): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATE);
    }

    /**
     * 날짜를 한국어 형식으로 변환
     */
    static toKoreanDate(date: Date | string | number): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.KOREAN_DATE);
    }

    /**
     * 날짜를 한국어 날짜시간 형식으로 변환
     */
    static toKoreanDateTime(date: Date | string | number): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.KOREAN_DATETIME);
    }

    /**
     * 날짜를 표시용 형식으로 변환
     */
    static toDisplayDate(date: Date | string | number): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.DISPLAY_DATE);
    }

    /**
     * 날짜를 표시용 날짜시간 형식으로 변환
     */
    static toDisplayDateTime(date: Date | string | number): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.DISPLAY_DATETIME);
    }

    /**
     * 두 날짜 사이의 차이를 계산
     */
    static diff(
        startDate: Date | string | number,
        endDate: Date | string | number,
        unit: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' = 'day',
    ): number {
        return dayjs(endDate).diff(dayjs(startDate), unit);
    }

    /**
     * 날짜에 시간 추가
     */
    static add(
        date: Date | string | number,
        amount: number,
        unit: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second',
    ): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).add(amount, unit).format(this.FORMATS.ISO_STRING);
    }

    /**
     * 날짜에서 시간 빼기
     */
    static subtract(
        date: Date | string | number,
        amount: number,
        unit: 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second',
    ): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).subtract(amount, unit).format(this.FORMATS.ISO_STRING);
    }

    /**
     * 날짜가 유효한지 확인
     */
    static isValid(date: Date | string | number): boolean {
        return dayjs(date).isValid();
    }

    /**
     * 날짜가 오늘인지 확인
     */
    static isToday(date: Date | string | number): boolean {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).isSame(dayjs().tz(this.DEFAULT_TIMEZONE), 'day');
    }

    /**
     * 날짜가 과거인지 확인
     */
    static isPast(date: Date | string | number): boolean {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).isBefore(dayjs().tz(this.DEFAULT_TIMEZONE));
    }

    /**
     * 날짜가 미래인지 확인
     */
    static isFuture(date: Date | string | number): boolean {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).isAfter(dayjs().tz(this.DEFAULT_TIMEZONE));
    }

    /**
     * 월의 시작일 반환
     */
    static startOfMonth(date: Date | string | number): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).startOf('month').format(this.FORMATS.ISO_STRING);
    }

    /**
     * 월의 마지막일 반환
     */
    static endOfMonth(date: Date | string | number): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).endOf('month').format(this.FORMATS.ISO_STRING);
    }

    /**
     * 연도 반환
     */
    static getYear(date: Date | string | number): number {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).year();
    }

    /**
     * 월 반환 (1-12)
     */
    static getMonth(date: Date | string | number): number {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).month() + 1;
    }

    /**
     * 일 반환
     */
    static getDate(date: Date | string | number): number {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).date();
    }

    /**
     * 시간 반환
     */
    static getHour(date: Date | string | number): number {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).hour();
    }

    /**
     * 분 반환
     */
    static getMinute(date: Date | string | number): number {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).minute();
    }

    /**
     * 초 반환
     */
    static getSecond(date: Date | string | number): number {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).second();
    }

    /**
     * 나이 계산
     */
    static calculateAge(birthDate: Date | string | number, baseDate?: Date | string | number): number {
        const base = baseDate ? dayjs(baseDate) : dayjs();
        const birth = dayjs(birthDate);
        return base.diff(birth, 'year');
    }

    /**
     * 근무 기간 계산 (월 단위)
     */
    static calculateWorkPeriod(startDate: Date | string | number, endDate?: Date | string | number): number {
        const end = endDate ? dayjs(endDate) : dayjs();
        const start = dayjs(startDate);
        return end.diff(start, 'month');
    }

    /**
     * 시간 문자열을 Date 객체로 변환
     */
    static parseTime(timeString: string, dateString?: string): Date {
        const date = dateString || this.today();
        return dayjs(`${date}T${timeString}`).tz(this.DEFAULT_TIMEZONE).toDate();
    }

    /**
     * Excel 날짜 형식을 Date로 변환
     */
    static fromExcelDate(excelDate: number): Date {
        // Excel의 1900년 1월 1일을 기준으로 계산
        const excelEpoch = new Date(1900, 0, 1);
        const msPerDay = 24 * 60 * 60 * 1000;
        return new Date(excelEpoch.getTime() + (excelDate - 1) * msPerDay);
    }

    /**
     * 한국 시간대로 변환
     */
    static toKoreanTime(date: Date | string | number): string {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATETIME);
    }

    /**
     * 근무 시간 계산 (시간 단위)
     */
    static calculateWorkHours(startTime: string, endTime: string, date?: string): number {
        const dateStr = date || this.today();
        const start = dayjs(`${dateStr}T${startTime}`);
        const end = dayjs(`${dateStr}T${endTime}`);
        return end.diff(start, 'hour', true);
    }
}
