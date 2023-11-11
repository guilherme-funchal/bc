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

  // const [userName, setName] = useState("");
  const [userProfile, setProfile] = useState(props.items[0].profile);
  // const [userDesc, setDesc] = useState("");
  // const [userEmail, setEmail] = useState("");
  const [userType, setType] = useState(props.items[0].type);
  // const [userDoc, setDoc] = useState("");
  // const [userId, setUserId] = useState("");

  // const closeOnEscapeKeyDown = e => {
  //   if ((e.charCode || e.keyCode) === 27) {
  //     props.onClose();
  //   }
  // };
  
  var name = props.items[0].name;
  var user_id = props.items[0].user_id;
  var profile = props.items[0].profile;
  var desc = props.items[0].desc;
  var email = props.items[0].email;
  var type = props.items[0].type;
  var doc = props.items[0].doc;
  var image = props.items[0].image;
  var created_at = props.items[0].created_at;
  var last_login = props.items[0].last_login;

  // const [, setValues] = useState({
  //   id: 0,
  //   state: ""
  // });
  
  // const inputRef = useRef()
  
  // const address = localStorage.getItem('wallet');
  
  // const [file, setFile] = useState('');
  // const [status, setStatus] = useState({
  //   type: '',
  //   mensagem: ''
  // });

  // const handlesubmit = () => {
  //   form.current.reset(); //this will reset all the inputs in the form
  // }

  // function resetForm() {
  //   document.getElementById("form").reset();
  // }

  // const reload = () => window.location.reload();
  const form = useRef(null);

  // const onChange = (e) => {
  //   setValues({
  //     ...form,
  //     [e.target.name]: e.target.value
  //   });
  // };
  
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
      user_id: "",
      profile: "",
      desc: "",
      name: "",
      email: "",
      type: "",
      doc: "",
      created_at: "",
      updated_at: "",
      last_login: "",
      image: ""
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
      "user_id": user_id,
      "profile": userProfile,
      "desc": desc,
      "name": name,
      "email": email,
      "type": userType,
      "doc": doc,
      "created_at": created_at,
      "updated_at": current,
      "last_login": last_login,
      "image": image
    };

      await api.patch('account/' + user_id, block);

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
                id="name"
                name="name"
                defaultValue={props.items[0].name}
                placeholder="Name"
                onChange={(e) => name=e.target.value}
              />  
          </Form.Group>
          <Form.Group as={Col} md="20" >
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                id="desc"
                name="desc"
                defaultValue={props.items[0].desc}
                placeholder="desc"
                onChange={(e) => desc=e.target.value}
              />  
          </Form.Group>
          <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Profile</Form.Label><br></br>
                {/* <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
              /> */}
                <select name="profile" value={profile} onChange={texto => setProfile(texto.target.value)}>
                  <option value="">Selecione um perfil</option>
                  <option value="certificador">Certificador</option>
                  <option value="registrador">Registrador</option>
                  <option value="propositor">Propositor</option>
                  <option value="comprador">Comprador</option>
                </select><br /><br />
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
          <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Tipo</Form.Label><br></br>
                <select name="type" value={type} onChange={tipo => setType(tipo.target.value)}>
                  <option value="">Selecione um tipo</option>
                  <option value="pf">Pesssoa física</option>
                  <option value="pj">Pessoa Jurídica</option>
                </select><br /><br />
              </Form.Group>  
          <Form.Group as={Col} md="20" >
              <Form.Label>Documento(CPF - RG -CNPJ)</Form.Label>
              <Form.Control
                type="text"
                id="doc"
                name="doc"
                defaultValue={props.items[0].doc}
                placeholder="type"
                onChange={(e) => doc=e.target.value}
              />  
          </Form.Group>
          <Form.Group as={Col} md="20" >
              <Form.Label>Imagem</Form.Label>
              <Form.Control
                type="text"
                id="image"
                name="image"
                defaultValue={props.items[0].image}
                placeholder="imagem"
                onChange={(e) => image=e.target.value}
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