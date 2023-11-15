import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Web3 from 'web3';
import React, { useState, useEffect } from 'react';

export default function Projetos() {
    const getTransactions = async () => {
        const response = await Api.get('transacoes');
        setTransactions(response.data);
    };

    const getSaldos = async (wallet) => {
        const response_moeda = await Api.get('saldo/' + wallet[0].user_id);
        var moeda = response_moeda.data;
        moeda = parseFloat(moeda);
        moeda = moeda.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        setMoeda(moeda);
    };

    const [users, setUsers] = useState([]);
    const MySwal = withReactContent(Swal);
    const [user, setUser] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [moeda, setMoeda] = useState([]);
    var transferir = 0;
    var total = 0;


    async function doTimestamp(param) {
        const block = { block: param };
        const response = Api.post('carimbo', block);
        var timestamp_result = (await response).data;
        var date = new Date(timestamp_result * 1000);
        var resultado = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        MySwal.fire({
            title: <strong>Timestamp do Bloco</strong>,
            html: <i>{resultado}</i>,
            icon: 'info'
        });
    }

    const getUsers = async () => {
        const response = await Api.get('account/list');
        setUsers(response.data);
    };

    async function viewUser(user_id) {
        const response = await Api.get('account/find/' + user_id);
        var html =
            '<p style="text-align:left;"><b>Email : </b><span>' + response.data[0].email + '</span></p>' +
            '<p style="text-align:left;"><b>UserID : </b><span>' + response.data[0].user_id + '</span></p>'
        MySwal.fire({
            width: 460,
            title: response.data[0].name,
            html: html,
            imageUrl: response.data[0].image,
            imageAlt: 'Custom image',
        })
    }

    useEffect(() => {
        var address = localStorage.getItem('wallet');
        if (address !== null) {
            setUser(JSON.parse(address));
            getTransactions();
            getSaldos(JSON.parse(address));
        } else {
            setUser(false);
        }

    }, [])

    var style = "width:50%;height:50%;";
    return (
        <div>
            <Header />
            <Sidenav />
            {/* Content Wrapper. Contains page content */}
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-success"><i className="ion ion-leaf"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Saldo</span>
                                <span className="info-box-number">{moeda}</span>
                            </div>

                        </div>

                    </div>

                </div>



                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Transações</h3>
                            </div>
                            <div>
                                <div className="card-body p-0">
                                    <div style={{ "font-size": "15px" }} class="table-responsive">
                                        {/* <table class="table-sm table-striped"> */}
                                        <table className="blueTable">
                                            <thead>
                                                <tr>
                                                    <th class="bg-primary"><center>Evento</center></th>
                                                    <th class="bg-primary"><center>Bloco</center></th>
                                                    <th class="bg-primary"><center>Origem</center></th>
                                                    <th class="bg-primary"><center>Destino</center></th>
                                                    <th class="bg-primary"><center>Valor</center></th>

                                                    <th class="bg-primary"><center>Timestamp</center></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((obj) => {
                                                    var visible = true;

                                                    const val = obj.returnValues;
                                                    let from = "";
                                                    let id = "";
                                                    let to = "";
                                                    let value = "";
                                                    let transferencia = "Transferir";

                                                    for (const key in val) {
                                                        if (key === "from") {
                                                            from = `${val[key]}`;
                                                            if (from === "0x0000000000000000000000000000000000000000" && obj.event === "Transfer") {
                                                                transferencia = "Depositar";
                                                            }
                                                        }
                                                        if (key === "to") {
                                                            to = `${val[key]}`;
                                                            if (to === "0x0000000000000000000000000000000000000000" && obj.event === "TransferS") {
                                                                transferencia = "Sacar";
                                                            }
                                                        }
                                                        else if (key === "id") {
                                                            id = `${val[key]}`;
                                                            if (id === "1") {
                                                                id = "Carbono";
                                                            } else {
                                                                id = "Moeda";
                                                            }
                                                        }

                                                        else if (key === "value") {
                                                            value = `${val[key]}`;
                                                            value = Web3.utils.fromWei(value, 'ether');
                                                            value = parseFloat(value);
                                                        }
                                                    }


                                                    if (user[0]?.profile === "certificador" || user[0]?.profile === "registrador" || user[0]?.user_id === to || user[0]?.user_id === from) {
                                                        visible = false;
                                                    }

                                                    if (obj.blockNumber == 1) {
                                                        visible = true;
                                                    }

                                                    return (
                                                        visible ? null
                                                            : (
                                                                <tr>
                                                                    <td><center>{transferencia}</center></td>
                                                                    <td><center>{obj.blockNumber}</center></td>
                                                                    <td><center>{from}</center></td>
                                                                    <td><center>{to}</center></td>
                                                                    <td><center>{value.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</center></td>
                                                                    <td><center><button className="btn text-red btn-sm" onClick={event => { doTimestamp(obj.blockNumber); }}
                                                                    ><i className="fa fa-clock fa-fw" style={{ fontSize: "15px" }}></i></button></center></td>
                                                                </tr>
                                                            )
                                                    );

                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /.content-wrapper */}
            <Footer />
        </div>
    )
}