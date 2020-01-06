import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { ZonesMongoDbPersistence } from '../persistence/ZonesMongoDbPersistence';
import { ZonesFilePersistence } from '../persistence/ZonesFilePersistence';
import { ZonesMemoryPersistence } from '../persistence/ZonesMemoryPersistence';
import { ZonesController } from '../logic/ZonesController';
import { ZonesHttpServiceV1 } from '../services/version1/ZonesHttpServiceV1';

export class ZonesServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-zones", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("iqs-services-zones", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("iqs-services-zones", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("iqs-services-zones", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-zones", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-zones", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(ZonesServiceFactory.MemoryPersistenceDescriptor, ZonesMemoryPersistence);
		this.registerAsType(ZonesServiceFactory.FilePersistenceDescriptor, ZonesFilePersistence);
		this.registerAsType(ZonesServiceFactory.MongoDbPersistenceDescriptor, ZonesMongoDbPersistence);
		this.registerAsType(ZonesServiceFactory.ControllerDescriptor, ZonesController);
		this.registerAsType(ZonesServiceFactory.HttpServiceDescriptor, ZonesHttpServiceV1);
	}
	
}
