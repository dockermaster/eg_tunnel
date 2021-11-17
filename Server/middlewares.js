const { LOCAL_HOSTNAME } = require('./env')
const { UUID_FROM_AGENT_FIELD } = require('./constants')
const { streamNewRequestToAgent, storeRequestFromClient, streamDestinationResponseToBackToClient, } = require('./handlers')

const proxyHandler = async (req, res, next) => {
    const isProxyRequest = !(req.headers.host === LOCAL_HOSTNAME);
    if (isProxyRequest) {
        return await storeRequestFromClient(req, res);
    }

    // console.log(`req.query: ${JSON.stringify(req.query)}`);
    const uuid = req.query[UUID_FROM_AGENT_FIELD];

    const isPollingForNewRequest = !uuid
    if (isPollingForNewRequest) {
        return await streamNewRequestToAgent(req, res);
    }
    
    // is a response from destination site that return from B,.
    return await streamDestinationResponseToBackToClient(req, res, uuid);
}

module.exports = {
    proxyHandler
}
