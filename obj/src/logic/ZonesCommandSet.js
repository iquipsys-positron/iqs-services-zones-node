"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const ZoneV1Schema_1 = require("../data/version1/ZoneV1Schema");
class ZonesCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetZonesCommand());
        this.addCommand(this.makeGetZoneByIdCommand());
        this.addCommand(this.makeCreateZoneCommand());
        this.addCommand(this.makeUpdateZoneCommand());
        this.addCommand(this.makeDeleteZoneByIdCommand());
        this.addCommand(this.makeUnsetObjectCommand());
        this.addCommand(this.makeUnsetGroupCommand());
    }
    makeGetZonesCommand() {
        return new pip_services3_commons_node_2.Command("get_zones", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getZones(correlationId, filter, paging, callback);
        });
    }
    makeGetZoneByIdCommand() {
        return new pip_services3_commons_node_2.Command("get_zone_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('zone_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let zone_id = args.getAsString("zone_id");
            this._logic.getZoneById(correlationId, zone_id, callback);
        });
    }
    makeCreateZoneCommand() {
        return new pip_services3_commons_node_2.Command("create_zone", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('zone', new ZoneV1Schema_1.ZoneV1Schema()), (correlationId, args, callback) => {
            let zone = args.get("zone");
            this._logic.createZone(correlationId, zone, callback);
        });
    }
    makeUpdateZoneCommand() {
        return new pip_services3_commons_node_2.Command("update_zone", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('zone', new ZoneV1Schema_1.ZoneV1Schema()), (correlationId, args, callback) => {
            let zone = args.get("zone");
            this._logic.updateZone(correlationId, zone, callback);
        });
    }
    makeDeleteZoneByIdCommand() {
        return new pip_services3_commons_node_2.Command("delete_zone_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('zone_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let zoneId = args.getAsNullableString("zone_id");
            this._logic.deleteZoneById(correlationId, zoneId, callback);
        });
    }
    makeUnsetObjectCommand() {
        return new pip_services3_commons_node_2.Command("unset_object", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('org_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('object_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let orgId = args.getAsNullableString("org_id");
            let objectId = args.getAsNullableString("object_id");
            this._logic.unsetObject(correlationId, orgId, objectId, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
    makeUnsetGroupCommand() {
        return new pip_services3_commons_node_2.Command("unset_group", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('org_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('group_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let orgId = args.getAsNullableString("org_id");
            let groupId = args.getAsNullableString("group_id");
            this._logic.unsetGroup(correlationId, orgId, groupId, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
}
exports.ZonesCommandSet = ZonesCommandSet;
//# sourceMappingURL=ZonesCommandSet.js.map