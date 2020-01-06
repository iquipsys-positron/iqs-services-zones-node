"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const iqs_clients_eventrules_node_1 = require("iqs-clients-eventrules-node");
const ZonesServiceFactory_1 = require("../build/ZonesServiceFactory");
class ZonesProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("zones", "Zones microservice");
        this._factories.add(new ZonesServiceFactory_1.ZonesServiceFactory);
        this._factories.add(new iqs_clients_eventrules_node_1.EventRulesClientFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.ZonesProcess = ZonesProcess;
//# sourceMappingURL=ZonesProcess.js.map