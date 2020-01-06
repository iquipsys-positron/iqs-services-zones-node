"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class ZonesMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('zones');
        super.ensureIndex({ org_id: 1 });
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    unsetObject(correlationId, orgId, objectId, callback) {
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
            if (callback)
                callback(err);
        });
    }
    unsetGroup(correlationId, orgId, groupId, callback) {
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
            if (callback)
                callback(err);
        });
    }
}
exports.ZonesMongoDbPersistence = ZonesMongoDbPersistence;
//# sourceMappingURL=ZonesMongoDbPersistence.js.map