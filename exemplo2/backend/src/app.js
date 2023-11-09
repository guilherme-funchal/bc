var express = require('express');
var app = express();
var address = "http://127.0.0.1:8545";

const uploadUser = require('./middlewares/uploadFiles');
const crypto = require('crypto');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

var Web3 = require('web3');

require("dotenv").config();

const CONTACT_ABI = require('./config');
const CONTACT_ADDRESS = require('./config');

const { application } = require('express');
const fs = require('fs');

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Openbadges API",
      description: "Customer API Information for Openbadges 2.0 By Funchal",
      contact: {
        name: "Openbadges Developer"
      },
      servers: ["http://localhost:3000"]
    }
  },
  // ['.routes/*.js']
  apis: ["app.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Functions for issuers

// Routes
/**
 * @swagger
 * /issuers:
 *  get:
 *    description: Use to request all issuers
 *    responses:
 *      '200':
 *        description: A successful response
 */

app.get('/issuers', async function (req, res) {
  var web3 = new Web3(address);
  var issuer_identificado = [];

  var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

  let issuers = await contratoInteligente.methods.getItemsIssuer().call(function (err, res) {
    if (err) {
      console.log("Ocorreu um erro", err)
      return
    }
  });

  const quantidade = issuers.length + 1;

  for (var i = 1; i < quantidade; i++) {
   
    let issuer = await contratoInteligente.methods.getIssuerByID(i).call(function (err, res) {
      if (err) {
        return
      }

    });
    

    if (issuer['0'] !== '0') {
      issuer_identificado.push({
        entityType: "Issuer",
        id: issuer['0'],
        entityId: issuer['1'],
        openBadgeId: "http://api.serpro.gov.br/public/issuers/" + issuer['1'],
        createAt: issuer['4'],
        createBy: issuer['5'],
        name: issuer['2'],
        image: issuer['6'],
        email: issuer['7'],
        description: issuer['3'],
        url: issuer['8'],
        staffId: issuer['7'],
        badgrDomain: issuer['9'],    
        extensions: ""
      });
    }
  }
      res.status(200).send(issuer_identificado);
});

// Routes
/**
 * @swagger
 * /issuers:
 *  post:
 *    description: Use to insert issuers
 *    responses:
 *      '200':
 *        description: A successful response
 */

app.post('/issuers', async function (req, res) {

  let now = Date.now();

  let entityId = String(crypto.randomUUID());
  let name = String(req.body.name);
  let description = String(req.body.description);
  let createdAt = String(now);
  let createdBy = String(req.body.createdBy);
  let image = String(req.body.image);
  let staffId = String(req.body.staffId);
  let email = String(req.body.email);
  let url = String(req.body.url);
  let domain = String(req.body.domain);
  
  const network = process.env.ETHEREUM_NETWORK;

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
     `${address}`
    )
  );

  
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  
  web3.eth.accounts.wallet.add(signer);

  var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

  const tx = contratoInteligente.methods.setIssuer(
    entityId,
    name,
    description,
    createdAt,
    createdBy,
    image,
    staffId,
    email,
    url,
    domain
  )

  const receipt = await tx
      .send({
        from: signer.address,
        gas: await tx.estimateGas(),
      })
      .once("transactionHash", (txhash) => {
        console.log(`Dados enviados com sucesso ...`);
      });
    res.status(200).send(`Dados inseridos no bloco ${receipt.blockNumber}`);
  });

  // Routes
/**
 * @swagger
 * /issuers:
 *  patch:
 *    description: Use to update issuers
 *    responses:
 *      '200':
 *        description: A successful response
 */

  app.patch('/issuers', async function (req, res) {

    let now = Date.now();
  
    let id = String(req.body.id);
    let name = String(req.body.name);
    let description = String(req.body.description);
    let image = String(req.body.image);
    let staffId = String(req.body.staffId);
    let email = String(req.body.email);
    let url = String(req.body.url);
    let domain = String(req.body.domain);
    
    const network = process.env.ETHEREUM_NETWORK;
  
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
       `${address}`
      )
    );
      
    const signer = web3.eth.accounts.privateKeyToAccount(
      process.env.SIGNER_PRIVATE_KEY
    );
    
    web3.eth.accounts.wallet.add(signer);
  
    var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);
  
    const tx = contratoInteligente.methods.updateIssuer(
      id,
      name,
      description,
      image,
      staffId,
      email,
      url,
      domain
    )
  
    const receipt = await tx
        .send({
          from: signer.address,
          gas: await tx.estimateGas(),
        })
        .once("transactionHash", (txhash) => {
          console.log(`Dados enviados com sucesso ...`);
        });
      res.status(200).send(`Dados inseridos no bloco ${receipt.blockNumber}`);
    });  

// Routes
/**
 * @swagger
 * /issuers:
 *  delete:
 *    description: Use to delete issuers
 *    responses:
 *      '200':
 *        description: A successful response
 */

    app.delete('/issuer/:id', async function (req, res) {

      let id = req.params.id
  
      const network = process.env.ETHEREUM_NETWORK;
  
      const web3 = new Web3(
        new Web3.providers.HttpProvider(
          `${address}`
        )
      );
      const signer = web3.eth.accounts.privateKeyToAccount(
        process.env.SIGNER_PRIVATE_KEY
      );
      web3.eth.accounts.wallet.add(signer);
      var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);
  
      const tx = contratoInteligente.methods.deleteIssuer(
        id
      );
  
      const receipt = await tx
        .send({
          from: signer.address,
          gas: await tx.estimateGas(),
        })
        .once("transactionHash", (txhash) => {
          console.log(`Dados enviados com sucesso ...`);
        });
      res.status(200).send(`Issuer excluído com sucesso`);
    });

    
// Functions for assertions

// Routes
/**
* @swagger
* /assertions:
*  get:
*    description: Use to request all assertions
*    responses:
*      '200':
*        description: A successful response
*/

app.get('/assertions', async function (req, res) {
  var web3 = new Web3(address);
  var assertions_identificado = [];

  var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

  let assertions = await contratoInteligente.methods.getItemsIssuer().call(function (err, res) {
    if (err) {
      console.log("Ocorreu um erro", err)
      return
    }
  });

  const quantidade = assertions.length + 1;

  for (var i = 1; i < quantidade; i++) {
   
    let assertion = await contratoInteligente.methods.getAssertionByID(i).call(function (err, res) {
      if (err) {
        console.log("Ocorreu um erro", err)
        return
      }

    });

    if (assertion['0'] !== "") {
      assertions_identificado.push({
        entityId: assertion['0'],
        openBadgeId: "http://api.serpro.gov.br/public/issuers/" + assertion['0'],
        createdAt: assertion['1'],
        image: assertion['2'],
        isssuerId: assertion['3'],
        badgeclassId: assertion['4'],
        recipienteId: assertion['5'],
        issueOn: assertion['6'],
        revoked: assertion['7'],
        revocationReason: assertion['8'],
        extensions: {}
      });
    }
    
  }
  
    res.status(200).send(assertions_identificado);

});

// Functions to BadgeClass

// Routes
/**
 * @swagger
 * /badgeclass:
 *  get:
 *    description: Use to request all badge class
 *    responses:
 *      '200':
 *        description: A successful response
 */

app.get('/badgeclass', async function (req, res) {
  var web3 = new Web3(address);
  var badge_identificado = [];

  var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);
  console.log(contratoInteligente);

  let badges = await contratoInteligente.methods.getItemsBadgeClass().call(function (err, res) {
    if (err) {
      console.log("Ocorreu um erro", err)
      return
    }
  });

  const quantidade = badges.length + 1;

  for (var i = 1; i < quantidade; i++) {
   
    let badge = await contratoInteligente.methods.getBadgeClassByID(i).call(function (err, res) {
      if (err) {
        console.log("Ocorreu um erro", err)
        return
      }

    });

    if (badge['0'] !== "0") {
      badge_identificado.push({
        type: "BadgeClass",
        id: badge['0'],
        entityId: badge['1'],
        createdAt: badge['2'],
        createdBy: badge['3'],
        name: badge['5'],
        image: badge['6'],
        description: badge['7'],
        criteriaUrl: badge['8'],
        criteriaNarrative: badge['9'],
        alignmentsTargetName: badge['10'],
        alignmentsTargetUrl: badge['11'],
        alignmentsTargetDescription: badge['12'],
        alignmentsTargetFramework: badge['13'],
        alignmentsTargetCode: badge['14'],
        tags: badge['15'],
        issuerId: badge['4'],
        expiresAmount: badge['16'],
        expiresDuration: badge['17'],
        extensions: ""
      });
    }
  }
  
    res.status(200).send(badge_identificado);

});

// Functions for BadgeClass
// Routes
/**
 * @swagger
 * /badgeclass:
 *  delete:
 *    description: Use to insert badgeclass
 *    responses:
 *      '200':
 *        description: A successful response
 */

app.post('/badgeclass', async function (req, res) {

  let now = Date.now();

  let entityId = String(crypto.randomUUID());
  let createdAt = String(now);
  let createdBy = String(req.body.createdBy);
  let name = String(req.body.name);
  let issuerId = String(req.body.issuerId);
  let image = String(req.body.image);
  let description = String(req.body.description);
  let criteriaUrl = String(req.body.criteriaUrl);
  let criteriaNarrative = String(req.body.criteriaNarrative);
  let alignmentsTargetName = String(req.body.alignmentsTargetName);
  let alignmentsTargetUrl = String(req.body.alignmentsTargetUrl);
  let alignmentsTargetDescription = String(req.body.alignmentsTargetDescription);
  let alignmentsTargetFramework = String(req.body.alignmentsTargetFramework);
  let alignmentsTargetCode = String(req.body.alignmentsTargetCode);
  let tags = String(req.body.tags);
  let expiresAmount = String(req.body.expiresAmount);
  let expiresDuration = String(req.body.expiresDuration);
  
  const network = process.env.ETHEREUM_NETWORK;

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
     `${address}`
    )
  );

  
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  
  web3.eth.accounts.wallet.add(signer);

  var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

  const tx = contratoInteligente.methods.setBadgeClass(
        entityId,
        createdAt,
        createdBy,
        issuerId,
        name,
        image,
        description,
        criteriaUrl,
        criteriaNarrative,
        alignmentsTargetName,
        alignmentsTargetUrl,
        alignmentsTargetDescription,
        alignmentsTargetFramework,
        alignmentsTargetCode,
        tags,
        expiresAmount,
        expiresDuration
  )

  const receipt = await tx
      .send({
        from: signer.address,
        gas: await tx.estimateGas(),
      })
      .once("transactionHash", (txhash) => {
        console.log(`Dados enviados com sucesso ...`);
      });
    res.status(200).send(`Dados inseridos no bloco ${receipt.blockNumber}`);
  });

// Functions for BadgeClass
// Routes
/**
 * @swagger
 * /badgeclass:
 *  delete:
 *    description: Use to delete badgeclass
 *    responses:
 *      '200':
 *        description: A successful response
 */

 app.delete('/badgeclass/:id', async function (req, res) {

  let id = req.params.id

  const network = process.env.ETHEREUM_NETWORK;

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `${address}`
    )
  );
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

  const tx = contratoInteligente.methods.deleteBadgeClass(
    id
  );

  const receipt = await tx
    .send({
      from: signer.address,
      gas: await tx.estimateGas(),
    })
    .once("transactionHash", (txhash) => {
      console.log(`Dados enviados com sucesso ...`);
    });
  res.status(200).send(`BadgeClass excluído com sucesso`);
});

// Functions for BadgeClass
// Routes
/**
 * @swagger
 * /badgeclass:
 *  patch:
 *    description: Use to update badgeclass
 *    responses:
 *      '200':
 *        description: A successful response
 */

 app.patch('/badgeclass', async function (req, res) {
  let id = String(req.body.id);
  let name = String(req.body.name);
  let description = String(req.body.description);
  let criteriaUrl = String(req.body.criteriaUrl);
  let criteriaNarrative = String(req.body.criteriaNarrative);
  let alignmentsTargetName = String(req.body.alignmentsTargetName);
  let alignmentsTargetUrl = String(req.body.alignmentsTargetUrl);
  let alignmentsTargetDescription = String(req.body.alignmentsTargetDescription);
  let alignmentsTargetFramework = String(req.body.alignmentsTargetFramework);
  let alignmentsTargetCode = String(req.body.alignmentsTargetCode);
  let tags = String(req.body.tags);
  let expiresAmount = String(req.body.expiresAmount);
  let expiresDuration = String(req.body.expiresDuration);
  
  const network = process.env.ETHEREUM_NETWORK;

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
     `${address}`
    )
  );

  
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  
  web3.eth.accounts.wallet.add(signer);

  var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

  const tx = contratoInteligente.methods.updateBadgeClass(
        id,
        name,
        description,
        criteriaUrl,
        criteriaNarrative,
        alignmentsTargetName,
        alignmentsTargetUrl,
        alignmentsTargetDescription,
        alignmentsTargetFramework,
        alignmentsTargetCode,
        tags,
        expiresAmount,
        expiresDuration
  )

  const receipt = await tx
      .send({
        from: signer.address,
        gas: await tx.estimateGas(),
      })
      .once("transactionHash", (txhash) => {
        console.log(`Dados enviados com sucesso ...`);
      });
    res.status(200).send(`Dados inseridos no bloco ${receipt.blockNumber}`);
  });


app.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});
