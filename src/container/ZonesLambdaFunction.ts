import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { ZonesServiceFactory } from '../build/ZonesServiceFactory';

export class ZonesLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("zones", "Zones function");
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-zones', 'controller', 'default', '*', '*'));
        this._factories.add(new ZonesServiceFactory());
    }
}

export const handler = new ZonesLambdaFunction().getHandler();