let _ = require('lodash');
let async = require('async');

import { IEventRulesClientV1 } from 'iqs-clients-eventrules-node';

import { ZoneV1 } from '../data/version1/ZoneV1';

export class EventRulesConnector {

    public constructor(
        private _eventRulesClient: IEventRulesClientV1
    ) {}

    public unsetZone(correlationId: string, obj: ZoneV1,
        callback: (err: any) => void) : void {
        
        if (this._eventRulesClient == null || obj == null) {
            callback(null);
            return;
        }

        this._eventRulesClient.unsetZone(correlationId, obj.org_id, obj.id, callback);
    }

}