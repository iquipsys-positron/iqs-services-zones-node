import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class ZoneV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('org_id', TypeCode.String);
        this.withRequiredProperty('type', TypeCode.String);
        this.withRequiredProperty('name', TypeCode.String);

        this.withOptionalProperty('center', null); //TypeCode.Object);
        this.withOptionalProperty('distance', TypeCode.Float);
        this.withOptionalProperty('geometry', null); //TypeCode.Object);
        this.withOptionalProperty('boundaries', null); //TypeCode.Object);

        this.withOptionalProperty('include_object_ids', new ArraySchema(TypeCode.String));
        this.withOptionalProperty('include_group_ids', new ArraySchema(TypeCode.String));
        this.withOptionalProperty('exclude_object_ids', new ArraySchema(TypeCode.String));
        this.withOptionalProperty('exclude_group_ids', new ArraySchema(TypeCode.String));
    }
}
