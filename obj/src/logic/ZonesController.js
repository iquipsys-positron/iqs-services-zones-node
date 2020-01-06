"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
let geojson = require('geojson-utils');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const ZoneTypeV1_1 = require("../data/version1/ZoneTypeV1");
const ZonesCommandSet_1 = require("./ZonesCommandSet");
const EventRulesConnector_1 = require("./EventRulesConnector");
class ZonesController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(ZonesController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._eventRulesClient = this._dependencyResolver.getOneOptional('event_rules');
        this._eventRulesConnector = new EventRulesConnector_1.EventRulesConnector(this._eventRulesClient);
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new ZonesCommandSet_1.ZonesCommandSet(this);
        return this._commandSet;
    }
    getZones(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getZoneById(correlationId, id, callback) {
        this._persistence.getOneById(correlationId, id, callback);
    }
    calculatePolygonBoundaries(geometry) {
        let coords = geometry.coordinates;
        let xAll = [], yAll = [];
        for (let i = 0; i < coords[0].length; i++) {
            xAll.push(coords[0][i][0]);
            yAll.push(coords[0][i][1]);
        }
        xAll = xAll.sort(function (a, b) { return a - b; });
        yAll = yAll.sort(function (a, b) { return a - b; });
        return {
            type: "Polygon",
            coordinates: [[[xAll[0], yAll[0]], [xAll[xAll.length - 1], yAll[yAll.length - 1]]]]
        };
    }
    calculateLineBoundaries(geometry) {
        let coords = geometry.coordinates;
        let xAll = [], yAll = [];
        for (let i = 0; i < coords.length; i++) {
            xAll.push(coords[i][0]);
            yAll.push(coords[i][1]);
        }
        xAll = xAll.sort(function (a, b) { return a - b; });
        yAll = yAll.sort(function (a, b) { return a - b; });
        return {
            type: "Polygon",
            coordinates: [[[xAll[0], yAll[0]], [xAll[xAll.length - 1], yAll[yAll.length - 1]]]]
        };
    }
    calculateCenter(boundaries) {
        let bbox = boundaries.coordinates[0];
        let xmin = bbox[0][0];
        let ymin = bbox[0][1];
        let xmax = bbox[1][0];
        let ymax = bbox[1][1];
        let xwidth = xmax - xmin;
        let ywidth = ymax - ymin;
        return {
            'type': 'Point',
            'coordinates': [xmin + xwidth / 2, ymin + ywidth / 2]
        };
    }
    calculateGeometry(zone) {
        if (zone.type == ZoneTypeV1_1.ZoneTypeV1.Line && zone.geometry && zone.geometry.type == 'LineString') {
            zone.boundaries = this.calculateLineBoundaries(zone.geometry);
            zone.center = this.calculateCenter(zone.boundaries);
        }
        else if (zone.type == ZoneTypeV1_1.ZoneTypeV1.Polygon && zone.geometry && zone.geometry.type == 'Polygon') {
            zone.boundaries = this.calculatePolygonBoundaries(zone.geometry);
            zone.center = this.calculateCenter(zone.boundaries);
        }
        else if (zone.type == ZoneTypeV1_1.ZoneTypeV1.Cirle && zone.center && zone.center.type == 'Point') {
            zone.geometry = geojson.drawCircle(zone.distance, zone.center, 10);
            zone.boundaries = this.calculatePolygonBoundaries(zone.geometry);
        }
        else {
            zone.geometry = null;
        }
    }
    fixZone(zone) {
        if (_.isString(zone.center))
            zone.center = JSON.parse(zone.center);
        if (_.isString(zone.geometry))
            zone.geometry = JSON.parse(zone.geometry);
    }
    createZone(correlationId, zone, callback) {
        this.fixZone(zone);
        this.calculateGeometry(zone);
        this._persistence.create(correlationId, zone, callback);
    }
    updateZone(correlationId, zone, callback) {
        this.fixZone(zone);
        this.calculateGeometry(zone);
        this._persistence.update(correlationId, zone, callback);
    }
    deleteZoneById(correlationId, id, callback) {
        let oldZone;
        async.series([
            // Delete zone
            (callback) => {
                this._persistence.deleteById(correlationId, id, (err, data) => {
                    oldZone = data;
                    callback(err);
                });
            },
            // Unset zone from rules
            (callback) => {
                if (oldZone)
                    this._eventRulesConnector.unsetZone(correlationId, oldZone, callback);
                else
                    callback();
            }
        ], (err) => {
            if (callback)
                callback(err, oldZone);
        });
    }
    unsetObject(correlationId, orgId, objectId, callback) {
        this._persistence.unsetObject(correlationId, orgId, objectId, callback);
    }
    unsetGroup(correlationId, orgId, groupId, callback) {
        this._persistence.unsetGroup(correlationId, orgId, groupId, callback);
    }
}
exports.ZonesController = ZonesController;
ZonesController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'iqs-services-zones:persistence:*:*:1.0', 'dependencies.event_rules', 'iqs-services-eventrules:client:*:*:1.0');
//# sourceMappingURL=ZonesController.js.map