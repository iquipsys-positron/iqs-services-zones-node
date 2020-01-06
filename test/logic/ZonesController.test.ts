let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { ZoneV1 } from '../../src/data/version1/ZoneV1';
import { ZoneTypeV1 } from '../../src/data/version1/ZoneTypeV1';
import { ZonesMemoryPersistence } from '../../src/persistence/ZonesMemoryPersistence';
import { ZonesController } from '../../src/logic/ZonesController';

let ZONE1: ZoneV1 = {
    id: '1',
    org_id: '1',
    type: 'line',
    name: 'Test zone 1',
    geometry: '{ "type": "LineString", "coordinates": [[0, 0], [1, 1]] }',
};
let ZONE2: ZoneV1 = {
    id: '2',
    org_id: '1',
    type: 'circle',
    name: 'Test zone 2',
    center: { type: 'Point', coordinates: [1, 1] },
};

suite('ZonesController', ()=> {    
    let persistence: ZonesMemoryPersistence;
    let controller: ZonesController;

    suiteSetup(() => {
        persistence = new ZonesMemoryPersistence();
        controller = new ZonesController();

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-zones', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-zones', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });
    
    
    test('CRUD Operations', (done) => {
        let zone1, zone2;

        async.series([
        // Create one zone
            (callback) => {
                controller.createZone(
                    null, ZONE1,
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.org_id, ZONE1.org_id);
                        assert.equal(zone.type, ZONE1.type);
                        assert.equal(zone.name, ZONE1.name);
                        assert.isNotNull(zone.center);
                        assert.isNotNull(zone.boundaries);

                        zone1 = zone;

                        callback();
                    }
                );
            },
        // Create another zone
            (callback) => {
                controller.createZone(
                    null, ZONE2,
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.org_id, ZONE2.org_id);
                        assert.equal(zone.type, ZONE2.type);
                        assert.equal(zone.name, ZONE2.name);
                        assert.isNotNull(zone.center);
                        assert.isNotNull(zone.boundaries);

                        zone2 = zone;

                        callback();
                    }
                );
            },
        // Get all zones
            (callback) => {
                controller.getZones(
                    null, null, null,
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Update the zone
            (callback) => {
                zone1.name = 'Updated zone 1';

                controller.updateZone(
                    null, zone1,
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.name, 'Updated zone 1');
                        assert.equal(zone.id, ZONE1.id);

                        zone1 = zone;

                        callback();
                    }
                );
            },
        // Delete zone
            (callback) => {
                controller.deleteZoneById(
                    null, zone1.id,
                    (err, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete zone
            (callback) => {
                controller.getZoneById(
                    null, zone1.id,
                    (err, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });
});