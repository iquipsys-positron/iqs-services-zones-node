"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
class ZoneV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('org_id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('type', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('name', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('center', null); //TypeCode.Object);
        this.withOptionalProperty('distance', pip_services3_commons_node_3.TypeCode.Float);
        this.withOptionalProperty('geometry', null); //TypeCode.Object);
        this.withOptionalProperty('boundaries', null); //TypeCode.Object);
        this.withOptionalProperty('include_object_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
        this.withOptionalProperty('include_group_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
        this.withOptionalProperty('exclude_object_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
        this.withOptionalProperty('exclude_group_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
    }
}
exports.ZoneV1Schema = ZoneV1Schema;
//# sourceMappingURL=ZoneV1Schema.js.map