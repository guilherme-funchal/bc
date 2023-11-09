
const routes = require('./routes');
const cors = require('cors');
const express = require('express');
var app = express();

const hostname = process.env.REST_HOST;
const port = process.env.REST_PORT;

app.use(cors());
app.use(express.json())
app.use(routes);

app.listen(port, hostname, () => {
  console.log(`Servidor rodando http://${hostname}:${port}/`);
});
