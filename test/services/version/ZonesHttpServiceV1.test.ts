let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { ZoneV1 } from '../../../src/data/version1/ZoneV1';
import { ZoneTypeV1 } from '../../../src/data/version1/ZoneTypeV1';
import { ZonesMemoryPersistence } from '../../../src/persistence/ZonesMemoryPersistence';
import { ZonesController } from '../../../src/logic/ZonesController';
import { ZonesHttpServiceV1 } from '../../../src/services/version1/ZonesHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

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

suite('ZonesHttpServiceV1', ()=> {    
    let service: ZonesHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new ZonesMemoryPersistence();
        let controller = new ZonesController();

        service = new ZonesHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-zones', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-zones', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-zones', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        let zone1, zone2;

        async.series([
        // Create one zone
            (callback) => {
                rest.post('/v1/zones/create_zone',
                    {
                        zone: ZONE1
                    },
                    (err, req, res, zone) => {
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
                rest.post('/v1/zones/create_zone', 
                    {
                        zone: ZONE2
                    },
                    (err, req, res, zone) => {
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
                rest.post('/v1/zones/get_zones',
                    {},
                    (err, req, res, page) => {
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

                rest.post('/v1/zones/update_zone',
                    { 
                        zone: zone1
                    },
                    (err, req, res, zone) => {
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
                rest.post('/v1/zones/delete_zone_by_id',
                    {
                        zone_id: zone1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete zone
            (callback) => {
                rest.post('/v1/zones/get_zone_by_id',
                    {
                        zone_id: zone1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });
});