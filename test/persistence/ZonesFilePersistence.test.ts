import { ConfigParams } from 'pip-services3-commons-node';

import { ZonesFilePersistence } from '../../src/persistence/ZonesFilePersistence';
import { ZonesPersistenceFixture } from './ZonesPersistenceFixture';

suite('ZonesFilePersistence', ()=> {
    let persistence: ZonesFilePersistence;
    let fixture: ZonesPersistenceFixture;
    
    setup((done) => {
        persistence = new ZonesFilePersistence('./data/zones.test.json');

        fixture = new ZonesPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
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