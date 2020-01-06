import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { ZonesMemoryPersistence } from './ZonesMemoryPersistence';
import { ZoneV1 } from '../data/version1/ZoneV1';
export declare class ZonesFilePersistence extends ZonesMemoryPersistence {
    protected _persister: JsonFilePersister<ZoneV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
