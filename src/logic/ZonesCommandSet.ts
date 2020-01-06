import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { ZoneV1 } from '../data/version1/ZoneV1';
import { ZoneV1Schema } from '../data/version1/ZoneV1Schema';
import { IZonesController } from './IZonesController';

export class ZonesCommandSet extends CommandSet {
    private _logic: IZonesController;

    constructor(logic: IZonesController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetZonesCommand());
		this.addCommand(this.makeGetZoneByIdCommand());
		this.addCommand(this.makeCreateZoneCommand());
		this.addCommand(this.makeUpdateZoneCommand());
		this.addCommand(this.makeDeleteZoneByIdCommand());
		this.addCommand(this.makeUnsetObjectCommand());
		this.addCommand(this.makeUnsetGroupCommand());
    }

	private makeGetZonesCommand(): ICommand {
		return new Command(
			"get_zones",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getZones(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetZoneByIdCommand(): ICommand {
		return new Command(
			"get_zone_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('zone_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let zone_id = args.getAsString("zone_id");
                this._logic.getZoneById(correlationId, zone_id, callback);
            }
		);
	}

	private makeCreateZoneCommand(): ICommand {
		return new Command(
			"create_zone",
			new ObjectSchema(true)
				.withRequiredProperty('zone', new ZoneV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let zone = args.get("zone");
                this._logic.createZone(correlationId, zone, callback);
            }
		);
	}

	private makeUpdateZoneCommand(): ICommand {
		return new Command(
			"update_zone",
			new ObjectSchema(true)
				.withRequiredProperty('zone', new ZoneV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let zone = args.get("zone");
                this._logic.updateZone(correlationId, zone, callback);
            }
		);
	}
	
	private makeDeleteZoneByIdCommand(): ICommand {
		return new Command(
			"delete_zone_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('zone_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let zoneId = args.getAsNullableString("zone_id");
                this._logic.deleteZoneById(correlationId, zoneId, callback);
			}
		);
	}

	private makeUnsetObjectCommand(): ICommand {
		return new Command(
			"unset_object",
			new ObjectSchema(true)
				.withRequiredProperty('org_id', TypeCode.String)
				.withRequiredProperty('object_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let orgId = args.getAsNullableString("org_id");
                let objectId = args.getAsNullableString("object_id");
                this._logic.unsetObject(correlationId, orgId, objectId, (err) => {
					if (callback) callback(err, null)
				});
			}
		);
	}

	private makeUnsetGroupCommand(): ICommand {
		return new Command(
			"unset_group",
			new ObjectSchema(true)
				.withRequiredProperty('org_id', TypeCode.String)
				.withRequiredProperty('group_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let orgId = args.getAsNullableString("org_id");
                let groupId = args.getAsNullableString("group_id");
                this._logic.unsetGroup(correlationId, orgId, groupId, (err) => {
					if (callback) callback(err, null)
				});
			}
		);
	}

}