import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { ZoneV1 } from '../data/version1/ZoneV1';

export interface IZonesController {
    getZones(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ZoneV1>) => void): void;

    getZoneById(correlationId: string, zone_id: string, 
        callback: (err: any, zone: ZoneV1) => void): void;

    createZone(correlationId: string, zone: ZoneV1, 
        callback: (err: any, zone: ZoneV1) => void): void;

    updateZone(correlationId: string, zone: ZoneV1, 
        callback: (err: any, zone: ZoneV1) => void): void;

    deleteZoneById(correlationId: string, zone_id: string,
        callback: (err: any, zone: ZoneV1) => void): void;

    unsetObject(correlationId: string, orgId: string, objectId: string,
        callback: (err: any) => void): void;

    unsetGroup(correlationId: string, orgId: string, groupId: string,
        callback: (err: any) => void): void;
}
