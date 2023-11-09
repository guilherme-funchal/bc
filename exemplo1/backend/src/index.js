const express = require('express');
var app = express();
var address = "http://127.0.0.1:8545";
const dotenv = require('dotenv');
const routes = require('./routes');
const uploadUser = require('./middlewares/uploadFiles');
const crypto = require('crypto');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

dotenv.config();
var Web3 = require('web3');



const CONTACT_ABI = require('./config');
const CONTACT_ADDRESS = require('./config');

const { application } = require('express');
const fs = require('fs');

const http = require('http');

const hostname = process.env.REST_HOST;
const port = process.env.REST_PORT;

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./database')

app.use(express.json())
app.use(routes);

app.listen(port, hostname, () => {
  console.log(`Servidor rodando http://${hostname}:${port}/`);
});
