import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Button } from "react-bootstrap";
import Api from '../../Api';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ModalViewProjeto(props) {

  const link = process.env.REACT_APP_REST_HOST +"/upload/" + props.items[0].documentation;

  async function viewUser(user_id) {
    var response = await Api.get('account/find/' + user_id);
    Swal.fire({
      title: response.data[0].name,
      text: response.data[0].email,
      imageUrl: response.data[0].image,
      imageAlt: 'Custom image',
    })
  }

  const style = { width: '800px' };

  var value = parseFloat(props.items[0].creditAssigned);
  value = value.toLocaleString('pt-br', { minimumFractionDigits: 2 });

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="modal" onClick={props.onClose}>
        <div className="modal-content" style={style} onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">Resumo do projeto</h4>
          </div>
          <div className="modal-body">
            <div className="timeline">

              <div className="time-label">
                <span classNames="bg-red">{props.items[0].updateDate}</span>
              </div>

              <div>
                <i class="fas fa-folder-open bg-blue"></i>
                <div key={Math.random()} className="timeline-item">
                  <span className="time"><i className="fas fa-file"></i> {props.items[0].id}</span>
                  <h3 className="timeline-header">Dados do projeto</h3>
                  <div className="timeline-body">
                  <b>Nome : </b>{props.items[0].name} <br></br>  
                  <b>Área : </b>{props.items[0].area} <br></br>
                  <b>Documentação :  </b><a href={link}>{props.items[0].documentation}</a><br></br>
                  <b>Hash : </b>{props.items[0].hash_documentation} <br></br>
                  <b>Estado : </b>{props.items[0].state} <br></br>
                  </div>
                </div>
              </div>

              <div>
                <i className="fas fa-cube bg-green"></i>
                <div key={Math.random()} className="timeline-item">
                  <span className="time"><i className="fas fa-dollar-sign"></i></span>
                  <h3 className="timeline-header">Transação</h3>
                  <div className="timeline-body">
                  <b>Crédito : </b>{value}<br></br>
                  <b>TX Hash : </b>{props.itemsTransactions[0].txhash}<br></br>
                  <b>Bloco  : </b>{props.itemsTransactions[0].block}<br></br>
                  </div>
                </div>
              </div>
              <div>
                <i className="fas fa-users bg-red"></i>
                <div key={Math.random()} className="timeline-item">
                  <span className="time"><i className="fas fa-info"></i></span>
                  <h3 className="timeline-header">Papeis</h3>
                  <div className="timeline-body" >
                  <b>Criador : </b>{props.items[0].projectCreator} <i style={{ cursor: "pointer" }} className="fas fa-user"  onClick={() => viewUser(props.items[0].projectCreator)}></i> <br></br>  
                  <b>Aprovador : </b>{props.items[0].projectApprover} <i style={{ cursor: "pointer" }} className="fas fa-user"  onClick={() => viewUser(props.items[0].projectApprover)}></i> <br></br>  
                  <b>Proprietário :  </b>{props.items[0].projectOwner} <i style={{ cursor: "pointer" }} className="fas fa-user"  onClick={() => viewUser(props.items[0].projectOwner)}></i> <br></br>  
                  </div>
                </div>
              </div>
              <div>
                <i className="fas fa-tachometer-alt bg-yellow"></i>
                <div key={Math.random()} className="timeline-item">
                  <span className="time"><i className="fas fa-tachometer-alt"></i></span>
                  <h3 className="timeline-header">Estado</h3>
                  <div className="timeline-body">
                  <b>{props.items[0].state}</b><br></br>  
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div key={Math.random()} className="modal-footer">
          <Button style={{ "width": "80px" }} onClick={props.onClose} variant="primary" type="submit">
            Fechar
          </Button>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );


};
