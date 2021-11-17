const SERVER_A_ADDRESS = process.env.SERVER_A_ADDRESS || 'http://localhost:8000/';
const POLLING_INTERVAL = Number(process.env.POLLING_INTERVAL || 100)


module.exports = {
    SERVER_A_ADDRESS,
    POLLING_INTERVAL
}
