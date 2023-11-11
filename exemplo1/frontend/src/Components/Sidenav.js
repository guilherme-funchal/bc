import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Sidenav() {

    const [user, setUser] = useState([]);
    const MySwal = withReactContent(Swal)

    useEffect((address) => {
        address = localStorage.getItem('wallet');

        if (address !== null){
            setUser(JSON.parse(address));
        }else{
            setUser(false);
        }
    }, []);

    let dashboard = false;
    let plataforma = false;
    let administracao = false;
    let projetos = false;
    let token = false;
    let transf = false;

    if (user[0]?.profile === 'certificador' || user[0]?.profile === 'comprador') {
        plataforma = true;
    }

    if (user[0]?.profile === 'registrador' || user[0]?.profile === 'certificador' || user[0]?.profile === 'propositor' || user[0]?.profile === 'comprador'){
        dashboard = true;
    }

    if (user[0]?.profile === 'registrador' || user[0]?.profile === 'certificador' || user[0]?.profile === 'propositor') {
        projetos = true;
    }

    if (user[0]?.profile === 'registrador') {
        administracao = true;
    }

    if (user[0]?.profile === 'registrador' || user[0]?.profile === 'certificador') {
        token = true;
        transf = true;
    }


    async function WalletAtual() {   

        var html =
          '<p style="text-align:left;"><b>Wallet : </b><span>' + user[0]?.user_id + '</span></p>' +
          '<p style="text-align:left;"><b>Nome : </b><span>' + user[0]?.name + '</span></p>' +
          '<p style="text-align:left;"><b>Perfil : </b><span>' + user[0]?.profile + '</span></p>' +
          '<p style="text-align:left;"><b>Descrição : </b><span>' + user[0]?.desc + '</span></p>' +
          '<p style="text-align:left;"><b>Email: </b><span>' + user[0]?.email + '</span></p>'

        if (user[0]?.type === 'pj') {
          html = html + '<p style="text-align:left;"><b>CNPJ: </b><span>' + user[0]?.doc + '</span></p>'
        } else {
          html = html + '<p style="text-align:left;"><b>CPF: </b><span>' + user[0]?.doc + '</span></p>'
        }
    
        MySwal.fire({
          width: 450,  
          html: html,
          imageUrl: user[0]?.image
        });
      }
    
    var image = String(user[0]?.image);

    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4 ">
                <Link to="/" className="brand-link text-center">
                    {/* <img src="dist/img/serpro.png" alt="Logo" className="brand-image" style={{ opacity: '.8' }} /> */}
                    <span className="brand-text font-weight-light text-left"><h6>DApp teste</h6></span>
                </Link>
                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        {image !== "undefined" &&
                            <>
                            <div className="image" style={{ cursor: "pointer" }}>
                            </div>    
                            <div className="info">
                            <p className="text-white">
                                {user[0]?.name}
                                {/* <button id="btn1" className="btn text-light" onClick={WalletAtual}><i className="fas fa fa-info" /> </button> */}
                            </p> 
                            </div>
                            </>
                        }
                    </div>
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column text-left" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    <i className="nav-icon fas  fa-bookmark" />
                                    <p>
                                        Inicio
                                    </p>
                                </Link>
                            </li>
                            { dashboard === true &&
                                <li className="nav-item">
                                    <Link to="/Dashboard" className="nav-link">
                                        <i className="nav-icon fas fa-tachometer-alt" />
                                        <p>
                                            Dashboard
                                        </p>
                                    </Link>
                                </li>
                            }            
                            { token === true &&
                                <li className="nav-item">
                                    <Link to="/Tokens" className="nav-link">
                                        <i className="nav-icon ion ion-cash" />
                                        <p>
                                            Tokens
                                        </p>
                                    </Link>
                                </li> 
                            }
                            { transf === true &&
                                <li className="nav-item">
                                    <Link to="/Transfer" className="nav-link">
                                        <i className="nav-icon fas fa  fa-arrows-alt" />
                                        <p>
                                            Transferências
                                        </p>
                                    </Link>
                                </li>
                            }
                            {administracao === true &&

                            <li className="nav-item">
                                <Link to="/Administracao" className="nav-link">
                                    <i className="nav-icon fas fa  fa-user" />
                                    <p>
                                        Usuários
                                    </p>
                                </Link>
                            </li>
                            }
                            {plataforma === true &&
                            <li className="nav-item">
                                <Link to="/Plataforma" className="nav-link">
                                    <i className="nav-icon fas fa  fa-sort" />
                                    <p>
                                        Plataforma
                                    </p>
                                </Link>
                            </li>
                            }
                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    )
}

