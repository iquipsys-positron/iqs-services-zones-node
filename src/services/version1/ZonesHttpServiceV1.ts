import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class ZonesHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/zones');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-zones', 'controller', 'default', '*', '1.0'));
    }
}