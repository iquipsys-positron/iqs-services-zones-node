import { IEventRulesClientV1 } from 'iqs-clients-eventrules-node';
import { ZoneV1 } from '../data/version1/ZoneV1';
export declare class EventRulesConnector {
    private _eventRulesClient;
    constructor(_eventRulesClient: IEventRulesClientV1);
    unsetZone(correlationId: string, obj: ZoneV1, callback: (err: any) => void): void;
}
