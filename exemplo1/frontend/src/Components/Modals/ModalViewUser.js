import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


function ModalViewUser(props) {

  const style = { width: '430px' }

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="modal">
        <div className="modal-dialog">
          <div className="modal-content" style={style} onClick={e => e.stopPropagation()}>
            {/* <div className="modal-header">
          <h4 className="modal-title">{props.title}</h4>
        </div> */}
            <div className="modal-body">
              <div className="card card-primary card-outline">
                <div className="card-body box-profile">
                  <div className="text-center">
                    <img className="profile-user-img img-fluid img-circle" src={props.items[0].image} alt="User profile picture" />
                  </div>
                  <h3 className="profile-username text-center">{props.items[0].name}</h3>
                  <p className="text-muted text-center">{props.items[0].email}</p>
                  <ul className="list-group list-group-unbordered mb-3">
                    <li className="list-group-item">
                      <b>User ID : </b>{props.items[0].user_id}
                    </li>
                  </ul>
                  <Button onClick={props.onClose} className="btn btn-primary btn-block"><b>Fechar</b></Button>
                </div>
              </div>
              <div><br></br></div>
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default ModalViewUser;