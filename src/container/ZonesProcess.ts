import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { EventRulesClientFactory } from 'iqs-clients-eventrules-node';

import { ZonesServiceFactory } from '../build/ZonesServiceFactory';

export class ZonesProcess extends ProcessContainer {

    public constructor() {
        super("zones", "Zones microservice");
        this._factories.add(new ZonesServiceFactory);
        this._factories.add(new EventRulesClientFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
