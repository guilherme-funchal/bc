import React from 'react';

export default function Home() {
  return (
    <div className="content-wrapper">
      <div classeName="content-header">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Bem-vindo</h3>
                <div className="card-tools">
                </div>
              </div>
              <div className="card-body">
                <div className="brand-text font-weight-light text-left">
                Bem-vindo ao Dapp em Ethereum para  testes.
                </div>
              </div>

              <div className="card-footer">
                <img className="img-fluid" src="dist/img/dapp.png" width="30%" height="30%" alt="imagem"></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
