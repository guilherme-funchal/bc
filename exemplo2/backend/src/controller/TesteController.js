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
    async listar(req, res) {
        try {
            var web3 = new Web3(process.env.ADDRESS_BC);
            var pessoa_identificada = [];

            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

            let pessoas = await contratoInteligente.methods.getItemsPessoa().call(function (err, res) {
                if (err) {
                    console.log("Ocorreu um erro", err)
                    return
                }
            });

            const quantidade = pessoas.length + 1;

            for (var i = 1; i < quantidade; i++) {

                let pessoa = await contratoInteligente.methods.getPessoaByID(i).call(function (err, res) {
                    if (err) {
                        return
                    }

                });


                if (pessoa['0'] !== '0') {
                    pessoa_identificada.push({
                        entityType: "Pessoa",
                        id: pessoa['0'],
                        nome: pessoa['1'],
                        email: pessoa['2'],
                        cpf: pessoa['3'],
                    });
                }
            }
            res.status(200).send(pessoa_identificada);
        } catch (e) {
            console.error(e)
        }
    },
    async inserir(req, res) {
        try {
            let nome = String(req.body.nome);
            let email = String(req.body.email);
            let cpf = String(req.body.cpf);

            const network = process.env.ETHEREUM_NETWORK;

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

            const tx = contratoInteligente.methods.setPessoa(
                nome,
                email,
                cpf
            )

            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Dados enviados com sucesso ...`);
                });
            res.status(200).send("Dados enviados com sucesso!");
        } catch (e) {
            console.error(e)
        }
    },
    async excluir(req, res) {
        try {
            let id = req.params.id

            const network = process.env.ETHEREUM_NETWORK;

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

            const tx = contratoInteligente.methods.deletePessoa(
                id
            );

            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Pessoa excluída com sucesso ...`);
                });
            res.status(200).send(`Pessoa excluído com sucesso`);
        } catch (e) {
            console.error(e)
        }
    },
    async atualizar(req, res) {
        try {
            let id = String(req.body.id);
            let nome = String(req.body.nome);
            let email = String(req.body.email);
            let cpf = String(req.body.cpf);

            const network = process.env.ETHEREUM_NETWORK;

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

            const tx = contratoInteligente.methods.updatePessoa(
                id,
                nome,
                email,
                cpf
            )

            const receipt = await tx
                .send({
                    from: signer.address,
                    gas: await tx.estimateGas(),
                })
                .once("transactionHash", (txhash) => {
                    console.log(`Dados atualizados com sucesso ...`);
                });
            res.status(200).send(`Dados atualizas no bloco ${receipt.blockNumber}`);
        } catch (e) {
            console.error(e)
        }
    },
    async buscar(req, res) {
        try {
            let id = String(req.params.id);

            var web3 = new Web3(process.env.ADDRESS_BC);
            var pessoa_identificada = [];

            var contratoInteligente = new web3.eth.Contract(CONTACT_ABI.CONTACT_ABI, CONTACT_ADDRESS.CONTACT_ADDRESS);

            let pessoas = await contratoInteligente.methods.getItemsPessoa().call(function (err, res) {
                if (err) {
                    console.log("Ocorreu um erro", err)
                    return
                }
            });

            const quantidade = pessoas.length + 1;

            for (var i = 1; i < quantidade; i++) {

                let pessoa = await contratoInteligente.methods.getPessoaByID(i).call(function (err, res) {
                    if (err) {
                        return
                    }

                });

                if (pessoa['0'] !== '0') {
                    if (id === pessoa['0']) {
                        pessoa_identificada.push({
                            entityType: "Pessoa",
                            id: pessoa['0'],
                            nome: pessoa['1'],
                            email: pessoa['2'],
                            cpf: pessoa['3'],
                        });
                    }
                }
            }
            if (pessoa_identificada.length !== 0) {
                res.status(200).send(pessoa_identificada);
            } else {
                res.status(201).send('empty');
            }
        } catch (e) {
            console.error(e)
        }
    },

}
