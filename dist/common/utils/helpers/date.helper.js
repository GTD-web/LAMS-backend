"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const duration = require("dayjs/plugin/duration");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
class DateHelper {
    static now() {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_STRING);
    }
    static today() {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATE);
    }
    static currentTime() {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_TIME);
    }
    static nowDateTime() {
        return dayjs().tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATETIME);
    }
    static format(date, format = this.FORMATS.ISO_STRING) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(format);
    }
    static toISOString(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_STRING);
    }
    static toISODate(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATE);
    }
    static toKoreanDate(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.KOREAN_DATE);
    }
    static toKoreanDateTime(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.KOREAN_DATETIME);
    }
    static toDisplayDate(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.DISPLAY_DATE);
    }
    static toDisplayDateTime(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.DISPLAY_DATETIME);
    }
    static diff(startDate, endDate, unit = 'day') {
        return dayjs(endDate).diff(dayjs(startDate), unit);
    }
    static add(date, amount, unit) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).add(amount, unit).format(this.FORMATS.ISO_STRING);
    }
    static subtract(date, amount, unit) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).subtract(amount, unit).format(this.FORMATS.ISO_STRING);
    }
    static isValid(date) {
        return dayjs(date).isValid();
    }
    static isToday(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).isSame(dayjs().tz(this.DEFAULT_TIMEZONE), 'day');
    }
    static isPast(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).isBefore(dayjs().tz(this.DEFAULT_TIMEZONE));
    }
    static isFuture(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).isAfter(dayjs().tz(this.DEFAULT_TIMEZONE));
    }
    static startOfMonth(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).startOf('month').format(this.FORMATS.ISO_STRING);
    }
    static endOfMonth(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).endOf('month').format(this.FORMATS.ISO_STRING);
    }
    static getYear(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).year();
    }
    static getMonth(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).month() + 1;
    }
    static getDate(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).date();
    }
    static getHour(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).hour();
    }
    static getMinute(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).minute();
    }
    static getSecond(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).second();
    }
    static calculateAge(birthDate, baseDate) {
        const base = baseDate ? dayjs(baseDate) : dayjs();
        const birth = dayjs(birthDate);
        return base.diff(birth, 'year');
    }
    static calculateWorkPeriod(startDate, endDate) {
        const end = endDate ? dayjs(endDate) : dayjs();
        const start = dayjs(startDate);
        return end.diff(start, 'month');
    }
    static parseTime(timeString, dateString) {
        const date = dateString || this.today();
        return dayjs(`${date}T${timeString}`).tz(this.DEFAULT_TIMEZONE).toDate();
    }
    static fromExcelDate(excelDate) {
        const excelEpoch = new Date(1900, 0, 1);
        const msPerDay = 24 * 60 * 60 * 1000;
        return new Date(excelEpoch.getTime() + (excelDate - 1) * msPerDay);
    }
    static toKoreanTime(date) {
        return dayjs(date).tz(this.DEFAULT_TIMEZONE).format(this.FORMATS.ISO_DATETIME);
    }
    static calculateWorkHours(startTime, endTime, date) {
        const dateStr = date || this.today();
        const start = dayjs(`${dateStr}T${startTime}`);
        const end = dayjs(`${dateStr}T${endTime}`);
        return end.diff(start, 'hour', true);
    }
}
exports.DateHelper = DateHelper;
DateHelper.DEFAULT_TIMEZONE = 'Asia/Seoul';
DateHelper.FORMATS = {
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
};
//# sourceMappingURL=date.helper.js.map