import { ExtractEventInfoType } from '@src/common/types/excel.type';
export declare class EventInfoEntity {
    eventId: string;
    employeeName: string;
    employeeNumber: string;
    eventTime: string;
    yyyymmdd: string;
    hhmmss: string;
    static fromEventInfo(eventInfo: any): EventInfoEntity;
    static fromEventInfoArray(eventInfoArray: ExtractEventInfoType[]): Partial<EventInfoEntity>[];
}
