"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const ZonesServiceFactory_1 = require("../build/ZonesServiceFactory");
class ZonesLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("zones", "Zones function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-zones', 'controller', 'default', '*', '*'));
        this._factories.add(new ZonesServiceFactory_1.ZonesServiceFactory());
    }
}
exports.ZonesLambdaFunction = ZonesLambdaFunction;
exports.handler = new ZonesLambdaFunction().getHandler();
//# sourceMappingURL=ZonesLambdaFunction.js.map