import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect, useCallback } from 'react';
import ModalAddProject from "./Modals/ModalAddProjeto";
import ModalEditProject from "./Modals/ModalEditProject";
import moment from 'moment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import ModalViewProject from  "./Modals/ModalViewProject";


export default function Projetos() {

  const Sucesso = Swal.mixin({
    toast: true,
    // position: 'center',
    iconColor: 'green',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });

  // const [AprovItems, setAprovItems] = useState([' ']);
  const [user, setUser] = useState([]);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [showModalAddProjeto, setShowModalAddProject] = useState(false);
  const [showModalViewProject, setShowModalViewProject] = useState(false);
  const [showModalEditProject, setShowModalEditProject] = useState(false);
  const [modal, setModal] = useState(false);

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

  const getProjetos = async (cod_paciente) => {
    const response = await Api.get('listarProjetos');
    setProjetos(response.data);
  };

  const toggle = () => {
    setModal(!modal);
  };
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState([]);
  // const [owner, setOwner] = useState(' ');
  // const [creator, setCreator] = useState(' ');
  // const [aprov, setAprov] = useState(' ');
  const [items, setItems] = useState([' ']);
  const [itemsTransactions, setItemsTransactions] = useState([' ']);
  const [taxas, setTaxas] = useState([]);
  const MySwal = withReactContent(Swal);

  const getTaxas = async () => {
    const response = await Api.get('tax/list');
    setTaxas(response.data);
  };

  const resumoProjeto = async (id) => {
    var response = await Api.get('projeto?id=' + id);
    setItems(response.data);
    await Api.get('credito?id=' + id);
    setItemsTransactions(response.data);
    setShowModalViewProject(true);
  }
  
  async function EditItemsProject(id) {
    var response = await Api.get('projeto?id=' + id);
    setItems(response.data);
  }

  async function viewProjeto(id) {
    var response = await Api.get('projeto?id=' + id);
    const link = process.env.REACT_APP_REST_HOST + "/upload/" + response.data[0].documentation;


    var html =
      '<p style="text-align:left;"><b>Nome : </b><span>' + response.data[0].name + '</span></p>' +
      '<p style="text-align:left;"><b>Descição : </b><span>' + response.data[0].description + '</span></p>' +
      '<p style="text-align:left;"><b>Área  : </b><span>' + response.data[0].area + '</span></p>' +
      '<p style="text-align:left;"><b>Estado  : </b><span>' + response.data[0].state + '</span></p>' +
      '<p style="text-align:left;"><b>Atualização  : </b><span>' + response.data[0].updateDate + '</span></p>' +
      '<p style="text-align:left;"><b>Arquivo  : </b><a href=' + link + '>' + response.data[0].documentation + '</a></p>' +
      '<p style="text-align:left;"><b>Hash do arquivo : </b><span>' + response.data[0].hash_documentation + '</span></p>'

    MySwal.fire({
      width: 600,
      html: html,
      icon: 'info'
    });

  }

  async function ViewTransaction(id) {
    var response = await Api.get('credito?id=' + id);
    var value = parseFloat(response.data[0].creditAssigned);

    if (response.data[0].id === '0') {
      Swal.fire('Projeto não processado!', '', 'error');
    } else {
      value = value.toLocaleString('pt-br', { minimumFractionDigits: 2 });

      var html =
        '<p style="text-align:left;"><b>Projeto ID : </b><span>' + response.data[0].id + '</span></p>' +
        '<p style="text-align:left;"><b>Crédito : </b><span>' + value + '</span></p>' +
        '<p style="text-align:left;"><b>TX Hash : </b><span>' + response.data[0].txhash + '</span></p>' +
        '<p style="text-align:left;"><b>Bloco  : </b><span>' + response.data[0].block + '</span></p>'

      MySwal.fire({
        width: 600,
        html: html,
        icon: 'info'
      });
    }

  }

  async function viewUser(user_id) {
    var response = await Api.get('account/find/' + user_id);
    Swal.fire({
      title: response.data[0].name,
      text: response.data[0].email,
      imageUrl: response.data[0].image,
      imageAlt: 'Custom image',
    })
  }

  async function editProjeto(id) {
    EditItemsProject(id);
    setShowModalEditProject(true);
  }

  async function delProjeto(id) {
    Swal.fire({
      title: 'Deseja excluir o projeto?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.isConfirmed) {
        Api.delete('projeto/' + id);

        Toast.fire({
          icon: 'success',
          title: 'Projeto excluído'
        });
        navigate(0);
      }

    })
  }

  useEffect(() => {
    var address = localStorage.getItem('wallet');
    if (address !== null) {
      setUser(JSON.parse(address));
      getProjetos();
      getTaxas();
    } else {
      setUser(false);
    }

  }, []);

  async function updadateProject(id, state) {

    if (state === true) {
      state = "concluido";
    }
    if (state === false) {
      state = "rejeitado";
    }

    var response = await Api.get('projeto?id=' + id);
    // setAprovItems(response.data);

    var current = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');

    let creditAssigned = 0;
    creditAssigned = response.data[0].area * taxas.carbono;

    const block = {
      "id": response.data[0].id,
      "name": response.data[0].name,
      "projectOwner": response.data[0].projectOwner,
      "projectCreator": response.data[0].projectCreator,
      "projectApprover": user[0].user_id,
      "description": response.data[0].description,
      "documentation": response.data[0].documentation,
      "hash_documentation": response.data[0].hash_documentation,
      "state": state,
      "area": response.data[0].area,
      "creditAssigned": String(creditAssigned),
      "updateDate": String(current)
    };

    var response_patch = await Api.patch('/projeto', block);

    if (response_patch.status === 200) {
      if (state === "concluido") {
        var block_money = {
          "account": response.data[0].projectOwner,
          "id": "1",
          "amount": String(creditAssigned),
          "data": "0x"
        };

        var response_emitir = await Api.post('emitir', block_money);

        var block_credito = {
          "id": response.data[0].id,
          "creditAssigned": String(creditAssigned),
          "txhash": String(response_emitir.data.txhash),
          "block": String(response_emitir.data.block)
        };

        response_emitir = await Api.post('credito', block_credito);

      }
      await Sucesso.fire({
        icon: 'success',
        title: 'Projeto sendo atualizado'
      });
    }

    navigate(0);
  }

  async function finalizarProjeto(id, state) {

    Swal.fire({
      title: 'Confirma aprovação do projeto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.isConfirmed) {
        updadateProject(id, state);
      }
    })
  }
  const style = { width: '93px' }

  return (
    <div>
      <Header />
      <Sidenav />
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Projetos</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
          <Button style={style} variant="primary" size="sm" onClick={() => setShowModalAddProject(true)}>
            <i class="fas fa-plus"></i> Novo
            </Button>
            {/* <table className="blueTable"> */}
            <div style={{ "font-size": "15px" }} class="table-responsive">
            {/* <table class="table-sm table-striped table-bordered  w-100 d-block d-md-table"> */}
              <table className="blueTable">
              <thead>
                <tr>
                  <th class="bg-primary"><center>Projeto ID</center></th>
                  <th class="bg-primary"><center>Nome do projeto</center></th>
                  <th class="bg-primary"><center>Proprietário</center></th>
                  <th class="bg-primary"><center>Criador</center></th>
                  <th class="bg-primary"><center>Estado</center></th>
                  {/* <th><center>Area</center></th>
                  <th><center>Valor</center></th> */}
                  {/* <th><center>Data criação</center></th> */}
                  {/* <th><center>Aposentado</center></th> */}
                  <th class="bg-primary"><center>Data atualização</center></th>
                  <th class="bg-primary"><center>Operações</center></th>
                </tr>
              </thead>
              <tbody>
                {    
                  projetos.map((data) => { 
                      var perfil = user[0]?.profile;
                      var state = true;
                      var options = false;


                      if (user[0]?.profile === "certificador" || user[0]?.profile === "registrador") {
                        if (data.state === 'rascunho' || data.state === 'rejeitado') {
                          state = true;
                        } else {
                          state = false;
                        } 
                      }

                      if ((user[0]?.profile === "certificador" || user[0]?.profile === "registrador") && (data.state === 'enviado')){
                        options = true;
                      }

                      if (user[0]?.user_id === data.projectOwner || user[0]?.user_id === data.projectCreator){
                        state = false;
                      }

                      if ((user[0]?.user_id === data.projectOwner || user[0]?.user_id === data.projectCreator) && (data.state === 'rascunho' || data.state === 'rejeitado')){
                        options = true;
                      }

                      if (data.id === '0')  {
                         state = true;
                      }

                      return (
                        state ? null
                        : (
                                <tr  key={Math.random()}>
                                <td  style={{ cursor: "pointer" }} key={data.id} onClick={() => ViewTransaction(data.id)}><center>{data.id}</center></td>
                                <td  style={{ cursor: "pointer" }} key={data.name} onClick={() => viewProjeto(data.id)}><center>{data.name}</center></td>
                                <td  style={{ cursor: "pointer" }} key={data.projectOwner} onClick={() => viewUser(data.projectOwner)}><center>{data.projectOwner}</center></td>
                                <td  style={{ cursor: "pointer" }} key={data.projectCreator} onClick={() => viewUser(data.projectCreator)}><center>{data.projectCreator}</center></td>
                                <td  style={{ cursor: "pointer" }} key={data.state}><center>{data.state}</center></td>
                                <td  style={{ cursor: "pointer" }} key={data.updateDate}><center>{data.updateDate}</center></td>

                                {options === false &&
                                <td><center><div><Button style={style} className="btn btn-default" variant="success" size="sm" onClick={() => resumoProjeto(data.id)}><i class="fas fa-glasses"></i> Visualiza</Button></div></center></td>
                                }
                                {options === true &&
                                  <>
                                  <td key={Math.random()}><center><div>
                                      <>
                                          {perfil === "propositor" &&
                                          <>
                                                <Button style={style} className="btn btn-default" variant="success" size="sm" onClick={() => resumoProjeto(data.id)}><i class="fas fa-glasses"></i> Visualiza</Button>
                                                <Button style={style} className="btn btn-default" variant="primary" size="sm" name="teste" onClick={() => editProjeto(data.id)}><i class="fas fa-edit"></i> Edita</Button>
                                                <Button style={style} className="btn btn-default" variant="danger" size="sm" onClick={() => delProjeto(data.id)}><i class="fas fa-eraser"></i> Exclui</Button>
                                          </>
                                          }
                                          {perfil === "certificador" &&
                                          <>
                                                <Button style={style} className="btn btn-default"  variant="primary" size="sm" onClick={() => finalizarProjeto(data.id, true)}><i class="fas fa-check"></i> Aprova</Button>
                                                <Button style={style} className="btn btn-default" variant="danger" size="sm" onClick={() => finalizarProjeto(data.id, false)}><i class="fas fa-eraser"></i> Rejeita</Button>
                                                <Button style={style} className="btn btn-default" variant="success" size="sm" onClick={() => resumoProjeto(data.id)}><i class="fas fa-glasses"></i> Visualiza</Button>
                                          </>
                                          }
                                          {perfil === "registrador" &&
                                            <>
                                                <Button style={style} className="btn btn-default" variant="success" size="sm" onClick={() => resumoProjeto(data.id)}><i class="fas fa-glasses"></i> Visualiza</Button>
                                            </>
                                          }
                                      </>    
                                    </div></center></td>
                                  </>
                                }
                            </tr>   
                      ));
                  })}

              </tbody>
            </table>
            </div>
            <ModalAddProject setShowModalAddProject={setShowModalAddProject} toggle={toggle} keyboard={false} projectOwner={user[0]?.user_id} backdrop={"static"} title="Adicionar projeto" onClose={() => { setShowModalAddProject(false); getProjetos(); forceUpdate(); setItems(' '); }} show={showModalAddProjeto} />
            <ModalEditProject toggle={toggle} keyboard={false} backdrop={"static"} title="Editar dados do projeto" items={items} onClose={() => { getProjetos(); forceUpdate(); setShowModalEditProject(false); setItems(' '); }} show={showModalEditProject} />
            <ModalViewProject  items={items} itemsTransactions={itemsTransactions} setShowModalViewProject={setShowModalViewProject} onClose={() => setShowModalViewProject(false)} show={showModalViewProject}/>
          </div>
        </section>

      </div>

      <Footer/>
    </div>
  )
}
