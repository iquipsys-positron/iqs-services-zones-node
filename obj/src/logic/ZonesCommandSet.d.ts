import { CommandSet } from 'pip-services3-commons-node';
import { IZonesController } from './IZonesController';
export declare class ZonesCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IZonesController);
    private makeGetZonesCommand;
    private makeGetZoneByIdCommand;
    private makeCreateZoneCommand;
    private makeUpdateZoneCommand;
    private makeDeleteZoneByIdCommand;
    private makeUnsetObjectCommand;
    private makeUnsetGroupCommand;
}
