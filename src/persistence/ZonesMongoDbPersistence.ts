let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { ZoneV1 } from '../data/version1/ZoneV1';
import { IZonesPersistence } from './IZonesPersistence';

export class ZonesMongoDbPersistence extends IdentifiableMongoDbPersistence<ZoneV1, string> implements IZonesPersistence {

    constructor() {
        super('zones');
        super.ensureIndex({ org_id: 1 });
        this._maxPageSize = 1000;
    }
    
    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ name: { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let org_id = filter.getAsNullableString('org_id');
        if (org_id != null)
            criteria.push({ org_id: org_id });

        let type = filter.getAsNullableString('type');
        if (type != null)
            criteria.push({ type: type });

        return criteria.length > 0 ? { $and: criteria } : null;
    }
    
    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ZoneV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public unsetObject(correlationId: string, orgId: string, objectId: string,
        callback: (err: any) => void): void {

        let filter = {
            org_id: orgId
        };

        let change = {
            $pull: { 
                include_object_ids: objectId,
                exclude_object_ids: objectId
            }
        };

        this._collection.updateMany(filter, change, (err, count) => {
            if (!err)
                this._logger.trace(correlationId, "Unset object %s from %s", objectId, this._collection);

            if (callback) callback(err);
        });
    }

    public unsetGroup(correlationId: string, orgId: string, groupId: string,
        callback: (err: any) => void): void {

        let filter = {
            org_id: orgId
        };

        let change = {
            $pull: { 
                include_group_ids: groupId,
                exclude_group_ids: groupId
            }
        };

        this._collection.updateMany(filter, change, (err, count) => {
            if (!err)
                this._logger.trace(correlationId, "Unset group %s from %s", groupId, this._collection);

            if (callback) callback(err);
        });
    }

}
