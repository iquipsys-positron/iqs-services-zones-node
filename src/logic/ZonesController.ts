let _ = require('lodash');
let async = require('async');
let geojson = require('geojson-utils');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';

import { IEventRulesClientV1 } from 'iqs-clients-eventrules-node';

import { ZoneV1 } from '../data/version1/ZoneV1';
import { ZoneTypeV1 } from '../data/version1/ZoneTypeV1';
import { IZonesPersistence } from '../persistence/IZonesPersistence';
import { IZonesController } from './IZonesController';
import { ZonesCommandSet } from './ZonesCommandSet';
import { EventRulesConnector } from './EventRulesConnector';

export class ZonesController implements  IConfigurable, IReferenceable, ICommandable, IZonesController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'iqs-services-zones:persistence:*:*:1.0',
        'dependencies.event_rules', 'iqs-services-eventrules:client:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(ZonesController._defaultConfig);
    private _eventRulesClient: IEventRulesClientV1;
    private _eventRulesConnector: EventRulesConnector;
    private _persistence: IZonesPersistence;
    private _commandSet: ZonesCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IZonesPersistence>('persistence');

        this._eventRulesClient = this._dependencyResolver.getOneOptional<IEventRulesClientV1>('event_rules');
        this._eventRulesConnector = new EventRulesConnector(this._eventRulesClient);
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new ZonesCommandSet(this);
        return this._commandSet;
    }
    
    public getZones(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ZoneV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getZoneById(correlationId: string, id: string, 
        callback: (err: any, zone: ZoneV1) => void): void {
        this._persistence.getOneById(correlationId, id, callback);
    }

    private calculatePolygonBoundaries(geometry: any) {
        let coords = geometry.coordinates;
        let xAll = [], yAll = [];

        for (let i = 0; i < coords[0].length; i++) {
            xAll.push(coords[0][i][0])
            yAll.push(coords[0][i][1])
        }

        xAll = xAll.sort(function (a, b) { return a - b })
        yAll = yAll.sort(function (a, b) { return a - b })

        return {
            type: "Polygon",
            coordinates: [ [[xAll[0], yAll[0]], [xAll[xAll.length - 1], yAll[yAll.length - 1]]] ]
        };
    }

    private calculateLineBoundaries(geometry: any) {
        let coords = geometry.coordinates;
        let xAll = [], yAll = [];

        for (let i = 0; i < coords.length; i++) {
            xAll.push(coords[i][0])
            yAll.push(coords[i][1])
        }

        xAll = xAll.sort(function (a, b) { return a - b })
        yAll = yAll.sort(function (a, b) { return a - b })

        return {
            type: "Polygon",
            coordinates: [ [[xAll[0], yAll[0]], [xAll[xAll.length - 1], yAll[yAll.length - 1]]] ]
        };
    }

    private calculateCenter(boundaries: any): any {
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

    private calculateGeometry(zone: ZoneV1): void {
        if (zone.type == ZoneTypeV1.Line && zone.geometry && zone.geometry.type == 'LineString') {
            zone.boundaries = this.calculateLineBoundaries(zone.geometry);
            zone.center = this.calculateCenter(zone.boundaries);
        } else if (zone.type == ZoneTypeV1.Polygon && zone.geometry && zone.geometry.type == 'Polygon') {
            zone.boundaries = this.calculatePolygonBoundaries(zone.geometry);
            zone.center = this.calculateCenter(zone.boundaries);
        } else if (zone.type == ZoneTypeV1.Cirle && zone.center && zone.center.type == 'Point') {
            zone.geometry = geojson.drawCircle(zone.distance, zone.center, 10);
            zone.boundaries = this.calculatePolygonBoundaries(zone.geometry);
        } else {
            zone.geometry = null;
        }
    }

    private fixZone(zone: ZoneV1): void {
        if (_.isString(zone.center))
            zone.center = JSON.parse(zone.center);
        if (_.isString(zone.geometry))
            zone.geometry = JSON.parse(zone.geometry);
    }

    public createZone(correlationId: string, zone: ZoneV1, 
        callback: (err: any, zone: ZoneV1) => void): void {

        this.fixZone(zone);
        this.calculateGeometry(zone);

        this._persistence.create(correlationId, zone, callback);
    }

    public updateZone(correlationId: string, zone: ZoneV1, 
        callback: (err: any, zone: ZoneV1) => void): void {

        this.fixZone(zone);
        this.calculateGeometry(zone);

        this._persistence.update(correlationId, zone, callback);
    }

    public deleteZoneById(correlationId: string, id: string,
        callback: (err: any, zone: ZoneV1) => void): void {
        let oldZone: ZoneV1;

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
                else callback();
            }
        ], (err) => {
            if (callback) callback(err, oldZone);
        });
    }

    public unsetObject(correlationId: string, orgId: string, objectId: string,
        callback: (err: any) => void): void {
        this._persistence.unsetObject(correlationId, orgId, objectId, callback);
    }

    public unsetGroup(correlationId: string, orgId: string, groupId: string,
        callback: (err: any) => void): void {
        this._persistence.unsetGroup(correlationId, orgId, groupId, callback);
    }

}
