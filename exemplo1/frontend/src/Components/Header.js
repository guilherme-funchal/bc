import React from 'react';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';

export default function Header() {

  useEffect(() => {
    const address = localStorage.getItem('wallet');
    setWallet(address);
  }, [])

  const [wallet, setWallet] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function doSignUpDirect() {
    setError('');
    const { value: wallet } = await Swal.fire({
      title: 'Insira a sua chave',
      icon: 'question',
      input: 'text',
      inputLabel: '',
      inputPlaceholder: 'Entre sua chave privada'
    })

    if (wallet) {
      var response = await Api.get('account/find/' + wallet);

      if (response.data.length === 0) {
        Swal.fire('Usuário não localizado!', '', 'error');
      } else {
        localStorage.setItem('wallet', JSON.stringify(response.data));
        navigate("/Dashboard");
        navigate(0);
      }
    }
  }

  async function doLogout() {
    Swal.fire({
      title: 'Desaja sair da plataforma?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('wallet');
        navigate("/");
        navigate(0);

        Swal.fire({
          title: "Desconectado",
          text: "Faça o login novamente",
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          }
        })

      }
    })
  }

  // async function doSignUp() {
  //   setError('');

  //   if (!window.ethereum) return MySwal.fire(<p><h6><b>Carteira não encontrada</b></h6></p>);

  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const accounts = await provider.send("eth_requestAccounts", []);
  //     if (!accounts || !accounts.length) return MySwal.fire(<p><h6><b>Carteira não encontrada</b></h6></p>);
  //     localStorage.setItem('wallet', accounts[0]);
  //     window.location.reload(false);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // }

  return (
    <div>
          <nav className="main-header navbar navbar-expand navbar-white navbar-light navbar-right">
            <ul className="navbar-nav ml-auto">
              {

                !wallet
                  ? (
                    <>
                      <div className="topnav-right">
                        <div className="nav-link" data-widget="control-sidebar" data-slide="true" onClick={doSignUpDirect}>
                          <i className="fa fa fa-lock fa-1" />
                        </div>
                      </div>
                      {/* <div className="topnav-right">
                        <a className="nav-link" data-widget="control-sidebar" data-slide="true" onClick={doSignUp}>
                          <i className="fa fa-lock" />
                        </a>
                      </div> */}
                    </>
                  )
                  : (
                    <>
                      <div className="topnav-right">

                        <div className="nav-link" data-widget="control-sidebar" data-slide="true" onClick={doLogout}>
                          <i className="fa fa-unlock-alt" />
                        </div>
                      </div>
                    </>
                  )
              }
              {
                error ? <p>{error}</p> : <></>
              }
            </ul>
          </nav>
        </div>

  )
}
