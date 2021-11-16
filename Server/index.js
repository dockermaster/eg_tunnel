const express = require('express');

const { PORT, LOCAL_HOSTNAME } = require('./env')
const { proxyHandler } = require('./middlewares') 

const app = express();

app.use(proxyHandler)


app.listen(PORT, () => {
    console.log(`proxy listening at ${LOCAL_HOSTNAME}`)
  });
