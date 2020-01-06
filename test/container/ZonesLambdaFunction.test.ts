let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { ZoneV1 } from '../../src/data/version1/ZoneV1';
import { ZoneTypeV1 } from '../../src/data/version1/ZoneTypeV1';
import { ZonesMemoryPersistence } from '../../src/persistence/ZonesMemoryPersistence';
import { ZonesController } from '../../src/logic/ZonesController';
import { ZonesLambdaFunction } from '../../src/container/ZonesLambdaFunction';

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

suite('ZonesLambdaFunction', ()=> {
    let lambda: ZonesLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'iqs-services-zones:persistence:memory:default:1.0',
            'controller.descriptor', 'iqs-services-zones:controller:default:default:1.0'
        );

        lambda = new ZonesLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var zone1, zone2;

        async.series([
        // Create one zone
            (callback) => {
                lambda.act(
                    {
                        role: 'zones',
                        cmd: 'create_zone',
                        zone: ZONE1
                    },
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.org_id, ZONE1.org_id);
                        assert.equal(zone.type, ZONE1.type);
                        assert.equal(zone.name, ZONE1.name);

                        zone1 = zone;

                        callback();
                    }
                );
            },
        // Create another zone
            (callback) => {
                lambda.act(
                    {
                        role: 'zones',
                        cmd: 'create_zone',
                        zone: ZONE2
                    },
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isObject(zone);
                        assert.equal(zone.org_id, ZONE2.org_id);
                        assert.equal(zone.type, ZONE2.type);
                        assert.equal(zone.name, ZONE2.name);

                        zone2 = zone;

                        callback();
                    }
                );
            },
        // Get all zones
            (callback) => {
                lambda.act(
                    {
                        role: 'zones',
                        cmd: 'get_zones' 
                    },
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

                lambda.act(
                    {
                        role: 'zones',
                        cmd: 'update_zone',
                        zone: zone1
                    },
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
                lambda.act(
                    {
                        role: 'zones',
                        cmd: 'delete_zone_by_id',
                        zone_id: zone1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete zone
            (callback) => {
                lambda.act(
                    {
                        role: 'zones',
                        cmd: 'get_zone_by_id',
                        zone_id: zone1.id
                    },
                    (err, zone) => {
                        assert.isNull(err);

                        assert.isNull(zone || null);

                        callback();
                    }
                );
            }
        ], done);
    });
});