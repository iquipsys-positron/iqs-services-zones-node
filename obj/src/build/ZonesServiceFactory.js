"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ZonesMongoDbPersistence_1 = require("../persistence/ZonesMongoDbPersistence");
const ZonesFilePersistence_1 = require("../persistence/ZonesFilePersistence");
const ZonesMemoryPersistence_1 = require("../persistence/ZonesMemoryPersistence");
const ZonesController_1 = require("../logic/ZonesController");
const ZonesHttpServiceV1_1 = require("../services/version1/ZonesHttpServiceV1");
class ZonesServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(ZonesServiceFactory.MemoryPersistenceDescriptor, ZonesMemoryPersistence_1.ZonesMemoryPersistence);
        this.registerAsType(ZonesServiceFactory.FilePersistenceDescriptor, ZonesFilePersistence_1.ZonesFilePersistence);
        this.registerAsType(ZonesServiceFactory.MongoDbPersistenceDescriptor, ZonesMongoDbPersistence_1.ZonesMongoDbPersistence);
        this.registerAsType(ZonesServiceFactory.ControllerDescriptor, ZonesController_1.ZonesController);
        this.registerAsType(ZonesServiceFactory.HttpServiceDescriptor, ZonesHttpServiceV1_1.ZonesHttpServiceV1);
    }
}
exports.ZonesServiceFactory = ZonesServiceFactory;
ZonesServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-zones", "factory", "default", "default", "1.0");
ZonesServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-zones", "persistence", "memory", "*", "1.0");
ZonesServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-zones", "persistence", "file", "*", "1.0");
ZonesServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-zones", "persistence", "mongodb", "*", "1.0");
ZonesServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-zones", "controller", "default", "*", "1.0");
ZonesServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-zones", "service", "http", "*", "1.0");
//# sourceMappingURL=ZonesServiceFactory.js.map