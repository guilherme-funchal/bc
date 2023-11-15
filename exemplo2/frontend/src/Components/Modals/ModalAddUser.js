import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button,Col } from "react-bootstrap";
import Api from '../../Api';
import Swal from 'sweetalert2';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";

function ModalAddUser(props) {

  const [userProfile, setProfile] = useState("");
  const [userType, setType] = useState("");
  const [current, setCurrent] = useState("");
  const form = useRef(null);

  useEffect(() => {
    var data = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');
    setCurrent(data);

  }, [])


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

  var profile = "";
  var type = "";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: "",
      email: "",
      cpf: ""
    },
  });

  async function submitForm(data) {
    const block = {
      "nome": data.nome,
      "email": data.email,
      "cpf": data.cpf
    };

    await Api.post('inserir/', block);

    await Toast.fire({
      icon: 'success',
      title: 'Usuário incluído'
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
            <h4 className="modal-title">Adicionar usuário</h4>
          </div>
          <div className="modal-body">
            <form ref={form} noValidate onSubmit={handleSubmit(submitForm)}>
              <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Nome</Form.Label>
                <Controller
                  name="nome"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="Nome"
                      isInvalid={errors.nome}
                    />
                  )}
                />
                {errors.name && (
                  <div className="invalid-feedback">
                    <Form.Control.Feedback type="invalid">
                      O campo é requerido
                    </Form.Control.Feedback>
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Email</Form.Label>
                <Controller
                  name="email"
                  control={control}
                  // onChange={(e) => setEmail(e.target.value)}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="Email"
                      isInvalid={errors.email}
                    />
                  )}
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    <Form.Control.Feedback type="invalid">
                      O campo é requerido
                    </Form.Control.Feedback>
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>CPF</Form.Label>
                <Controller
                  name="cpf"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="cpf"
                      isInvalid={errors.cpf}
                    />
                  )}
                />
                {errors.cpf && (
                  <div className="invalid-feedback">
                    <Form.Control.Feedback type="invalid">
                      O campo é requerido
                    </Form.Control.Feedback>
                  </div>
                )}
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

export default ModalAddUser;