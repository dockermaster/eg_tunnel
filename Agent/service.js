const axios = require('axios').default;; // TODO: use user-agent to limit the number of open ports.
const { HTTP_CODE, UUID_FROM_AGENT_FIELD } = require('./constants')
const { SERVER_A_ADDRESS } = require('./env')


async function pollPendingRequestFromServer() {
    return await axios({
        method: 'get',
        url: SERVER_A_ADDRESS,
        // responseType: 'stream'
    });
}

async function executeRequest(request) {
    return await axios(
        {
            url: request.url,
            method: request.method,
            headers: request.headers,
            data: request.body,
        }
    );
}

async function sendResponseBackToServer({ data, uuid }) {
    return await axios(
        {
            url: `${SERVER_A_ADDRESS}?${UUID_FROM_AGENT_FIELD}=${uuid}`,
            method: 'post',
            data: data,
        }
    );
}

async function handlePollingFromServer() {
    try {
        const response = await pollPendingRequestFromServer();

        const isNotPendingRequest = response.status === HTTP_CODE.NO_CONTENT;
        if (isNotPendingRequest) return;

        const responseFromDestinationSite = await executeRequest(response.data.request);

        await sendResponseBackToServer({ data: responseFromDestinationSite.data, uuid: response.data.uuid });
    } catch (e) {
        // TODO: handle errors
        console.log('error!!' + e)
    }
}


module.exports = {
    handlePollingFromServer,
}
