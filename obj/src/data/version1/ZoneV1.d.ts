import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class ZoneV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    type: string;
    name: string;
    center?: any;
    distance?: number;
    geometry?: any;
    boundaries?: any;
    include_object_ids?: string[];
    exclude_object_ids?: string[];
    include_group_ids?: string[];
    exclude_group_ids?: string[];
}
