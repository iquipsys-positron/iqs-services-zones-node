let ZonesProcess = require('../obj/src/container/ZonesProcess').ZonesProcess;

try {
    new ZonesProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
