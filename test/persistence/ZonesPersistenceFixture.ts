let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { ZoneV1 } from '../../src/data/version1/ZoneV1';
import { ZoneTypeV1 } from '../../src/data/version1/ZoneTypeV1';

import { IZonesPersistence } from '../../src/persistence/IZonesPersistence';

let ZONE1: ZoneV1 = {
    id: '1',
    org_id: '1',
    type: 'line',
    name: 'Test zone 1',
    geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
};
let ZONE2: ZoneV1 = {
    id: '2',
    org_id: '1',
    type: 'circle',
    name: 'Test zone 2',
    center: { type: 'Point', coordinates: [1, 1] },
};
let ZONE3: ZoneV1 = {
    id: '3',
    org_id: '2',
    type: 'object',
    name: 'Test zone 2',
    distance: 10,
    include_group_ids: ['1']
};

export class ZonesPersistenceFixture {
    private _persistence: IZonesPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateZones(done) {
        async.series([
        // Create one zone
            (callback) => {
                this._persistence.create(
                    null,
                    ZONE1,
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.org_id, ZONE1.org_id);
                        assert.equal(zone.type, ZONE1.type);
                        assert.equal(zone.name, ZONE1.name);

                        callback();
                    }
                );
            },
        // Create another zone
            (callback) => {
                this._persistence.create(
                    null,
                    ZONE2,
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.org_id, ZONE2.org_id);
                        assert.equal(zone.type, ZONE2.type);
                        assert.equal(zone.name, ZONE2.name);

                        callback();
                    }
                );
            },
        // Create yet another zone
            (callback) => {
                this._persistence.create(
                    null,
                    ZONE3,
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.org_id, ZONE3.org_id);
                        assert.equal(zone.type, ZONE3.type);
                        assert.equal(zone.name, ZONE3.name);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let zone1: ZoneV1;

        async.series([
        // Create items
            (callback) => {
                this.testCreateZones(callback);
            },
        // Get all zones
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        zone1 = page.data[0];

                        callback();
                    }
                );
            },
        // Update the zone
            (callback) => {
                zone1.name = 'Updated zone 1';

                this._persistence.update(
                    null,
                    zone1,
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.name, 'Updated zone 1');
                        assert.equal(zone.id, zone1.id);

                        callback();
                    }
                );
            },
        // Delete zone
            (callback) => {
                this._persistence.deleteById(
                    null,
                    zone1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete zone
            (callback) => {
                this._persistence.getOneById(
                    null,
                    zone1.id,
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isNull(zone || null);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilter(done) {
        async.series([
        // Create zones
            (callback) => {
                this.testCreateZones(callback);
            },
        // Get zones filtered by org_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, zones) => {
                        assert.isNull(err);

                        assert.isObject(zones);
                        assert.lengthOf(zones.data, 2);

                        callback();
                    }
                );
            },
        // Get zones filtered by type
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        type: 'line'
                    }),
                    new PagingParams(),
                    (err, zones) => {
                        assert.isNull(err);

                        assert.isObject(zones);
                        assert.lengthOf(zones.data, 1);

                        callback();
                    }
                );
            },
        // Get zones filtered by search
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                         search: 'test'
                    }),
                    new PagingParams(),
                    (err, zones) => {
                        assert.isNull(err);

                        assert.isObject(zones);
                        assert.lengthOf(zones.data, 3);

                        callback();
                    }
                );
            },
        ], done);
    }

    public testUnsetReferences(done) {
        async.series([
        // Create zone
            (callback) => {
                this._persistence.create(
                    null,
                    {
                        id: '5',
                        org_id: '1',
                        type: 'line',
                        name: 'Test zone 1',
                        geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
                        include_object_ids: ['1', '2'],
                        exclude_object_ids: ['1', '2'],
                        include_group_ids: ['1', '2'],
                        exclude_group_ids: ['1', '2']
                    },
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.org_id, ZONE1.org_id);
                        assert.lengthOf(zone.include_object_ids, 2);
                        assert.lengthOf(zone.exclude_object_ids, 2);
                        assert.lengthOf(zone.include_group_ids, 2);
                        assert.lengthOf(zone.exclude_group_ids, 2);

                        callback();
                    }
                );
            },
        // Unset object
            (callback) => {
                this._persistence.unsetObject(
                    null, '1', '1',
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Unset group
            (callback) => {
                this._persistence.unsetGroup(
                    null, '1', '1',
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Get and check the zone
            (callback) => {
                this._persistence.getOneById(
                    null,
                    '5',
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.org_id, ZONE1.org_id);
                        assert.lengthOf(zone.include_object_ids, 1);
                        assert.lengthOf(zone.exclude_object_ids, 1);
                        assert.lengthOf(zone.include_group_ids, 1);
                        assert.lengthOf(zone.exclude_group_ids, 1);

                        callback();
                    }
                );
            }
        ], done);
    }

}
