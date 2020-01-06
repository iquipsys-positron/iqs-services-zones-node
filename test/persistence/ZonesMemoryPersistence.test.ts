import { ConfigParams } from 'pip-services3-commons-node';

import { ZonesMemoryPersistence } from '../../src/persistence/ZonesMemoryPersistence';
import { ZonesPersistenceFixture } from './ZonesPersistenceFixture';

suite('ZonesMemoryPersistence', ()=> {
    let persistence: ZonesMemoryPersistence;
    let fixture: ZonesPersistenceFixture;
    
    setup((done) => {
        persistence = new ZonesMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new ZonesPersistenceFixture(persistence);
        
        persistence.open(null, done);
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

    test('Unset References', (done) => {
        fixture.testUnsetReferences(done);
    });

});