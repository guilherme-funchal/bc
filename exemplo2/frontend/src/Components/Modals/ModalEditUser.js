import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Col } from "react-bootstrap";
import api from '../../Api';
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";

function ModalEditUser (props) {

  var id = props.items[0].id;
  var nome = props.items[0].name;
  var email = props.items[0].email;
  var cpf = props.items[0].cpf;


  const form = useRef(null);

  
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-right',
    iconColor: 'green',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });


  const {
    // control,
    handleSubmit,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      nome: "",
      email: "",
      cpf: ""
    },
  });

  async function submitForm(data){ 

    // const form = data.currentTarget;
    // var block = ""
    // var response = '';
    var current = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');
       
    var block = {
      "id": id,
      "nome": nome,
      "email": email,
      "cpf": cpf,
    };

      await api.patch('atualizar/', block);

      await Toast.fire({
        icon: 'success',
        title: 'Usuário atualizado'
      });

    props.onClose();
  }


return ReactDOM.createPortal(
  <CSSTransition
    in={props.show}
    unmountOnExit
    timeout={{ enter: 0, exit: 300 }}
  >
    <div className="modal">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">Editar usuário</h4>
        </div>
        <div className="modal-body">
          <form ref={form} noValidate onSubmit={handleSubmit(submitForm)}>
          <Form.Group as={Col} md="20" >
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                id="nome"
                name="nome"
                defaultValue={props.items[0].nome}
                placeholder="Name"
                onChange={(e) => nome=e.target.value}
              />  
          </Form.Group>  
          <Form.Group as={Col} md="20" >
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                id="email"
                name="email"
                defaultValue={props.items[0].email}
                placeholder="email"
                onChange={(e) => email=e.target.value}
              />  
          </Form.Group>
          <Form.Group as={Col} md="20" >
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type="text"
                id="cpf"
                name="cpf"
                defaultValue={props.items[0].cpf}
                placeholder="type"
                onChange={(e) => cpf=e.target.value}
              />  
          </Form.Group>
            <br></br>
            <div className="text-right">
              <Button variant="danger" onClick={props.onClose} size="sm">
              <i class="fas fa-trash"> Cancela</i>
              </Button>
              <Button variant="primary" type="submit" size="sm">
              <i class="fas fa-check"> Salvar</i>
              </Button>
            </div>
          </form>
        </div>
        <div className="modal-footer">
        </div>
      </div>

    </div>
  </CSSTransition>,
  document.getElementById("root")
);
};

export default ModalEditUser;