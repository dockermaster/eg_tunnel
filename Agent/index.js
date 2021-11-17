const { POLLING_INTERVAL } = require('./env')
const { handlePollingFromServer } = require('./service')
// set pooling
setInterval(async () => {
    await handlePollingFromServer();
}, POLLING_INTERVAL);
