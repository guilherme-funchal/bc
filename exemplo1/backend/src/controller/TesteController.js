const CONTACT_ABI = require('./../config');
const CONTACT_ADDRESS = require('./../config');
const Web3 = require('web3');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const jsonFileList = './user-list.json'
const fs = require('fs');
const jsonFile = './data.json'

require("dotenv").config();

module.exports = {

    async saldo(req, res) {
        try {
            let conta = req.params.conta;
            var web3 = new Web3(process.env.ADDRESS_BC);

            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);
            let saldo = await contratoInteligente.methods.balanceOf(conta).call(function (err, res) {
                if (err) {
                    console.log("Ocorreu um erro", err)
                    return
                }
                console.log("Saldo gerado com Sucesso")
            });
            saldo = Web3.utils.fromWei(saldo, 'ether');
            res.status(200).send(JSON.stringify(saldo));
            console.log(saldo);
        } catch (e) {
            saldo = 0;
            res.status(400).send("Usuário não encontrado");
            console.error("Usuário não encontrado");
        }
    },

    async transacoes(req, res) {
        try {
            var web3 = new Web3(process.env.ADDRESS_BC);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);
            contratoInteligente.getPastEvents(
                "allEvents",
                { fromBlock: 0, toBlock: 'latest' },
                (err, events) => {
                    res.status(200).send(events);
                }
            );
        } catch (e) {
            console.error(e)
        }
    },
    async account(req, res) {
        try {
            const user_id = req.params.user_id
            var result = [];
            const jsonData = fs.readFileSync(jsonFile)
            const userList = JSON.parse(jsonData)

            for (var i = 0; i < userList.length; i++) {
                if (userList[i]["user_id"] == user_id) {
                    result.push(userList[i]);
                }
            }

            // res.send(account)
            res.status(200).send(JSON.stringify(userList));

        } catch (e) {
            console.error(e)
        }
    },
    async accountlist(req, res) {
        try {
            const user_id = req.params.user_id
            var result = [];
            const jsonData = fs.readFileSync(jsonFile)
            const userList = JSON.parse(jsonData)

            // for (var i = 0; i < userList.length; i++) {
            //     if (userList[i]["user_id"] == user_id) {
            //         result.push(userList[i]);
            //     }
            // }

            // res.send(account)
            res.status(200).send(JSON.stringify(userList));

        } catch (e) {
            console.error(e)
        }
    },
    async depositar(req, res) {
        try {
            let to = req.body.to;
            let amount = req.body.amount;
            amount = Web3.utils.toWei(amount, 'ether');

            const web3 = new Web3(
                new Web3.providers.HttpProvider(
                    `${process.env.ADDRESS_BC}`
                )
            );
            const signer = web3.eth.accounts.privateKeyToAccount(
                process.env.SIGNER_PRIVATE_KEY
            );
            web3.eth.accounts.wallet.add(signer);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

            const tx = contratoInteligente.methods.mint(to, amount);
            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Dados enviados com sucesso ...`);
                });
            console.log(`Dados incluídos no bloco ${receipt.blockNumber}`);
            // res.status(200).send(`Moeda incluída e minerada no bloco ${receipt.blockNumber}`);

            res.status(200).json({
                txhash: receipt.transactionHash,
                block: receipt.blockNumber
            });
        } catch (e) {
            console.error(e)
        }
    },
    async sacar(req, res) {
        try {
            let to = req.body.to;
            let amount = req.body.amount;
            amount = Web3.utils.toWei(amount, 'ether');

            const web3 = new Web3(
                new Web3.providers.HttpProvider(
                    `${process.env.ADDRESS_BC}`
                )
            );
            const signer = web3.eth.accounts.privateKeyToAccount(
                process.env.SIGNER_PRIVATE_KEY
            );
            web3.eth.accounts.wallet.add(signer);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

            const tx = contratoInteligente.methods.burn(to, amount);
            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Dados enviados com sucesso ...`);
                });
            console.log(`Dados incluídos no bloco ${receipt.blockNumber}`);
            // res.status(200).send(`Moeda incluída e minerada no bloco ${receipt.blockNumber}`);

            res.status(200).json({
                txhash: receipt.transactionHash,
                block: receipt.blockNumber
            });
        } catch (e) {
            console.error(e)
        }
    },
    async transferir(req, res) {
        try {
            let to = req.body.to;
            let from = req.body.from;
            let value = req.body.value;
            value = Web3.utils.toWei(value, 'ether');

            const web3 = new Web3(
                new Web3.providers.HttpProvider(
                    `${process.env.ADDRESS_BC}`
                )
            );
            const signer = web3.eth.accounts.privateKeyToAccount(
                process.env.SIGNER_PRIVATE_KEY
            );
            web3.eth.accounts.wallet.add(signer);
            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

            const tx = contratoInteligente.methods.transferirValor(from, to, value);
            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Dados enviados com sucesso ...`);
                });
            console.log(`Dados incluídos no bloco ${receipt.blockNumber}`);
            // res.status(200).send(`Moeda incluída e minerada no bloco ${receipt.blockNumber}`);

            res.status(200).json({
                txhash: receipt.transactionHash,
                block: receipt.blockNumber
            });
        } catch (e) {
            console.error(e)
        }
    },
}
