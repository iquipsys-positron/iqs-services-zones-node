"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
class EventRulesConnector {
    constructor(_eventRulesClient) {
        this._eventRulesClient = _eventRulesClient;
    }
    unsetZone(correlationId, obj, callback) {
        if (this._eventRulesClient == null || obj == null) {
            callback(null);
            return;
        }
        this._eventRulesClient.unsetZone(correlationId, obj.org_id, obj.id, callback);
    }
}
exports.EventRulesConnector = EventRulesConnector;
//# sourceMappingURL=EventRulesConnector.js.map