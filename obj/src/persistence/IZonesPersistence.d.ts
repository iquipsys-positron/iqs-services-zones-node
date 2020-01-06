import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';
import { ZoneV1 } from '../data/version1/ZoneV1';
export interface IZonesPersistence extends IGetter<ZoneV1, string>, IWriter<ZoneV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ZoneV1>) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: ZoneV1) => void): void;
    create(correlationId: string, item: ZoneV1, callback: (err: any, item: ZoneV1) => void): void;
    update(correlationId: string, item: ZoneV1, callback: (err: any, item: ZoneV1) => void): void;
    deleteById(correlationId: string, id: string, callback: (err: any, item: ZoneV1) => void): void;
    unsetObject(correlationId: string, orgId: string, objectId: string, callback: (err: any) => void): void;
    unsetGroup(correlationId: string, orgId: string, groupId: string, callback: (err: any) => void): void;
}
