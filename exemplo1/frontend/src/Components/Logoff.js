import React from 'react';

export default function Home() {
  return (
    <div className="content-wrapper">
      <div classeName="content-header">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Informação</h3>
                <div className="card-tools">
                </div>
              </div>
              <div className="card-body">
                <p>Usuário desconectado</p>
              </div>

              <div className="card-footer">
                <img className="img-fluid" src="dist/img/dapp.png" width="10%" height="10%" alt="imagem"></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
