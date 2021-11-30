const { uuid: uuidv4 } = require('uuidv4');
const { HTTP_CODE } = require('./constants');

// in memory storage:
const requestsBuffer = [] // [{ req, uuid, timestmp } ]
const responsesBuffer = {} // { [uuid]: { res, timestamp } }


const streamNewRequestToAgent = async (req, res) => {
    const isRequestBufferEmpty = !requestsBuffer.length;

    if (isRequestBufferEmpty) {
        return res.sendStatus(HTTP_CODE.NO_CONTENT);
        //return res.send(HTTP_CODE.NO_CONTENT); // no content.
    }

    // pop out the latest request from the store.
    const oldestRecord = requestsBuffer.shift(); // fifo

    // return oldestRecord.req.pipe(res); // TODO: use pipe instead of res.json if possible.

    console.log('originalUrl::', oldestRecord.req.originalUrl)
    return res.json({
        uuid: oldestRecord.uuid,
        request: {
            method: oldestRecord.req.method,
            url: oldestRecord.req.originalUrl,
            httpVersion: 'HTTP/' + oldestRecord.req.httpVersion,
            headers: { ...oldestRecord.req.headers || [] },
        },
    })
}

const storeRequestFromClient = async (req, res) => {
    const uuid = uuidv4();
    const now = Date.now();


    // store request in array so we can pull them by the original order.
    requestsBuffer.push({ uuid, req, timestamp: now });

    // store response by uuid so we can tunnel the response back to the right original response
    responsesBuffer[uuid] = { res, timestamp: now };
}

const streamDestinationResponseToBackToClient = async (req, res, uuid) => {
    const record = responsesBuffer[uuid];

    if (!record) {
        // console.log(`response not found for uuid (${uuid})`);
        return res.status(204);
    }

    // clear response from memory:
    delete responsesBuffer[uuid];

    // stream response back to original request.
    req.pipe(record.res);
}

module.exports = {
    streamNewRequestToAgent,
    storeRequestFromClient,
    streamDestinationResponseToBackToClient,
}
