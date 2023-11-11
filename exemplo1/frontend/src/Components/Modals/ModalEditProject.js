import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import Api from '../../Api';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";

function ModalEditProjeto (props) {
   
  var state = props.items[0].state;
  var area = props.items[0].area;
  var id = props.items[0].id;
  var name = props.items[0].name;
  var approver = props.items[0].projectApprover;
  var description = props.items[0].description;
  var owner = props.items[0].projectOwner;
  var creator = props.items[0].projectCreator;
  var documentation = props.items[0].documentation;
  var hash_documentation = props.items[0].hash_documentation;

  const form = useRef(null);
  
  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm({
  });


  async function submitForm(data){
    // const form = data.currentTarget;    
    var block = ""
    var current = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');
    
    if (state === "on"){
      state = "enviado";
    }

    block = {
      "id": id,
      "name": name,
      "projectOwner": owner,
      "projectCreator": creator,
      "projectApprover": approver,
      "description": description,
      "documentation": documentation,
      "hash_documentation": hash_documentation,
      "state": state,
      "area": area,
      "creditAssigned": "0",
      "updateDate": String(current)
    };

    await Api.patch('/projeto', block);
    props.onClose();
  }
  const style = { width: '85px' }

return ReactDOM.createPortal(
  <CSSTransition
    in={props.show}
    unmountOnExit
    timeout={{ enter: 0, exit: 300 }}
  >
    <div className="modal">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">{props.title}</h4>
        </div>
        <div className="modal-body">
        <form ref={form} noValidate onSubmit={handleSubmit(submitForm)}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Form.Check 
                      type="switch"
                      id="state"
                      label="Cadastramento concluído"
                      onChange={(e) => state=e.target.value}
                    />
                  )}
                />
              </Form.Group>
            </Row>
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
            <Form.Group as={Col} md="20">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                id="description"
                name="description"
                defaultValue={props.items[0].description}
                placeholder="Description"
                onChange={(e) => description=e.target.value}
              />  
            </Form.Group>
            <Form.Group as={Col} md="20" >
              <Form.Label>Documentação</Form.Label>
              <Form.Control
                type="textarea"
                id="documentacao"
                name="documentation"
                defaultValue={props.items[0].documentation}
                placeholder="Documentation"
                onChange={(e) => documentation=e.target.value}
                />  
            </Form.Group>
            <Form.Group as={Col} md="20" >
            <Form.Label>Area em hectares</Form.Label>
                <Form.Control
                type="text"
                id="area"
                name="area"
                defaultValue={props.items[0].area}
                placeholder="Area"
                onChange={(e) => area=e.target.value}
                />  
            </Form.Group>
            <br></br>
            <div className="text-right">
            <Button style={style} variant="danger" onClick={props.onClose} size="sm">
              <i class="fas fa-ban"></i> Cancela
              </Button>
              <Button style={style} variant="primary" type="submit" size="sm">
              <i class="fas fa-check"></i> Salvar
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

export default ModalEditProjeto;