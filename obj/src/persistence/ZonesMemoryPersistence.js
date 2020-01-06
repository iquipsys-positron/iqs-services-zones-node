"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class ZonesMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._maxPageSize = 1000;
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        return false;
    }
    contains(array1, array2) {
        if (array1 == null || array2 == null)
            return false;
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1])
                    return true;
        }
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let orgId = filter.getAsNullableString('org_id');
        let type = filter.getAsNullableString('type');
        return (item) => {
            if (id && item.id != id)
                return false;
            if (orgId && item.org_id != orgId)
                return false;
            if (type && item.type != type)
                return false;
            if (search && !this.matchSearch(item, search))
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    unsetObject(correlationId, orgId, objectId, callback) {
        let updated = false;
        _.each(this._items, (item) => {
            if (item.org_id == orgId && _.indexOf(item.include_object_ids, objectId) >= 0) {
                updated = true;
                item.include_object_ids = _.remove(item.include_object_ids, (i) => i == objectId);
            }
            if (item.org_id == orgId && _.indexOf(item.exclude_object_ids, objectId) >= 0) {
                updated = true;
                item.exclude_object_ids = _.remove(item.exclude_object_ids, (i) => i == objectId);
            }
        });
        if (!updated) {
            if (callback)
                callback(null);
            return;
        }
        this._logger.trace(correlationId, "Unset object %s", objectId);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err);
        });
    }
    unsetGroup(correlationId, orgId, groupId, callback) {
        let updated = false;
        _.each(this._items, (item) => {
            if (item.org_id == orgId && _.indexOf(item.include_group_ids, groupId) >= 0) {
                updated = true;
                item.include_group_ids = _.remove(item.include_group_ids, (i) => i == groupId);
            }
            if (item.org_id == orgId && _.indexOf(item.exclude_group_ids, groupId) >= 0) {
                updated = true;
                item.exclude_group_ids = _.remove(item.exclude_group_ids, (i) => i == groupId);
            }
        });
        if (!updated) {
            if (callback)
                callback(null);
            return;
        }
        this._logger.trace(correlationId, "Unset group %s", groupId);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err);
        });
    }
}
exports.ZonesMemoryPersistence = ZonesMemoryPersistence;
//# sourceMappingURL=ZonesMemoryPersistence.js.map