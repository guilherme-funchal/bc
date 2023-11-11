import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import { Button } from 'react-bootstrap/';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from "moment";
import ModalViewProject from  "./Modals/ModalViewProject";

export default function Plataforma() {
  const Sucesso = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'green',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

  const Falha = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'falha',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState([]);
  const [itemsTransactions, setItemsTransactions] = useState([' ']);
  const resumoProjeto = async (id) => {
    var response = await Api.get('projeto?id=' + id);
    setItems(response.data);
    response = await Api.get('credito?id=' + id);
    setItemsTransactions(response.data);
    setShowModalViewProject(true);
  }

  const getTaxas = async () => {
    const response = await Api.get('tax/list');
    setTaxas(response.data);
  };

  const getProjetos = async (cod_paciente) => {
    const response = await Api.get('listarProjetos');
    setProjetos(response.data);
  };

  // async function ViewItemsTransactions(id) {
  //   var response = await Api.get('credito?id=' + id);
  //   setItemsTransactions(response.data);
  // }

  const MySwal = withReactContent(Swal);

  async function ViewTransaction(id) {
    var response = await Api.get('credito?id=' + id);


    var value = parseFloat(response.data[0].creditAssigned);
    value = value.toLocaleString('pt-br', { minimumFractionDigits: 2 });

    var html =
          '<p style="text-align:left;"><b>Projeto ID : </b><span>' + response.data[0].id + '</span></p>' +
          '<p style="text-align:left;"><b>Crédito : </b><span>' + value + '</span></p>' +
          '<p style="text-align:left;"><b>TX Hash  : </b><span>' + response.data[0].txhash + '</span></p>' +
          '<p style="text-align:left;"><b>Bloco  : </b><span>' + response.data[0].block + '</span></p>'
    
        MySwal.fire({
          width: 600,
          html: html,
          icon: 'info'
        });

  }

  // const style = { width: '90px' }
  const [taxas, setTaxas] = useState([]);
  // const [usuarios, setUsuarios] = useState([]);
  const [user, setUser] = useState([]);
  const [saldoCarbono, setCarbono] = useState('');
  const [saldoMoeda, setMoeda] = useState([]);
  // const forceUpdate = useCallback(() => updateState({}), [])
  // const [, updateState] = useState();
  const [items, setItems] = useState([' ']);
  // const [itemsUser, setItemsUser] = useState([' ']);
  const [showModalViewProject, setShowModalViewProject] = useState(false);

  // const Toast = Swal.mixin({
  //   toast: true,
  //   position: 'bottom-right',
  //   iconColor: 'green',
  //   customClass: {
  //     popup: 'colored-toast'
  //   },
  //   showConfirmButton: false,
  //   timer: 2500,
  //   timerProgressBar: true
  // });

  async function doTransfer(origem, destino, id, valor) {
    var block = {
      "from": String(origem),
      "to": String(destino),
      "id": String(id),
      "amount": String(valor),
      "data": "0x"
    };

    const response = await Api.post('transferir', block);
    if (response.status === 200){
      return true;
    } else  {
      return false;
    }
  }
  
  const updateProject = async (project_id, comprador) => {
    var result = await Api.get('projeto?id=' + project_id);

    var current = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');

    var block = {
      "id": result.data[0]?.id,
      "name": result.data[0]?.name,
      "projectOwner": user[0]?.user_id,
      "projectCreator": result.data[0]?.projectCreator,
      "projectApprover": result.data[0]?.projectApprover,
      "description": result.data[0]?.description,
      "documentation": result.data[0]?.documentation,
      "hash_documentation": result.data[0]?.hash_documentation,
      "state": "adquirido",
      "area": result.data[0]?.area,
      "creditAssigned": result.data[0]?.creditAssigned,
      "updateDate": String(current)
    };

    const response = await Api.patch('/projeto', block);

    if (response.status === 200){
      return true;
    } else  {
      return false;
    }

  }


  async function exeTransfer(vendedor, comprador, credito, moeda, project_id){

    var test = await  updateProject(project_id, comprador);

    if (test === true) {
      test = await doTransfer(comprador, vendedor, 0, moeda);
    }

    if (test === true) {
      await doTransfer(vendedor, comprador, 1, credito);
    }

    if (test === true) {
      await Sucesso.fire({
      icon: 'success',
      title: 'Crédito de Carbono adquirido'
    })
    navigate(0);
    }
  }

  const getSaldos = async (wallet) => {
    const response_carbono = await Api.get('saldo?conta=' + wallet[0].user_id + '&wallet=1');
    var carbono = response_carbono.data;
    carbono = parseFloat(carbono);
    await setCarbono(carbono);
    const response_moeda = await Api.get('saldo?conta=' + wallet[0].user_id + '&wallet=0');
    var moeda = response_moeda.data;
    moeda = parseFloat(moeda);
    await setMoeda(moeda);
  };
  
  
  const viewProjeto= async (id) => {
    const response = await Api.get('projeto?id=' + id);

    const link = process.env.REACT_APP_REST_HOST + "/upload/" + response.data[0].documentation;

    var html =
    '<p style="text-align:left;"><b>Nome : </b><span>' + response.data[0].name + '</span></p>' +
    '<p style="text-align:left;"><b>Descição : </b><span>' + response.data[0].description + '</span></p>' +
    '<p style="text-align:left;"><b>Área  : </b><span>' + response.data[0].area + '</span></p>' +
    '<p style="text-align:left;"><b>Estado  : </b><span>' + response.data[0].state + '</span></p>' +
    '<p style="text-align:left;"><b>Atualização  : </b><span>' + response.data[0].updateDate + '</span></p>' +
    '<p style="text-align:left;"><b>Arquivo  : </b><a href=' + link + '>' +  response.data[0].documentation + '</a></p>' +
    '<p style="text-align:left;"><b>Hash do arquivo : </b><span>' + response.data[0].hash_documentation + '</span></p>'

  MySwal.fire({
    width: 600,
    html: html,
    icon: 'info'
  });

  };

  const viewUser= async (user_id) => {
    const response = await Api.get('account/find/' + user_id);
    Swal.fire({
      title: response.data[0].name,
      text: response.data[0].email,
      imageUrl: response.data[0].image,
      imageAlt: 'Custom image',
    })
  };


  async function exeAposentar(block1, block2){
    await Api.post('queimar', block1);
    await Api.patch('/projeto', block2);

    Sucesso.fire({
      icon: 'success',
      title: 'Carbono aposentado'
    });
    navigate(0);
  }

  async function aposentarCredito(id, saldoCarbono) {
    var current = moment()
    .utcOffset('-03:00')
    .format('DD/MM/YYYY hh:mm:ss a');
    var result = await Api.get('projeto?id=' + id);
    var block2 = {
      "id": result.data[0]?.id,
      "name": result.data[0]?.name,
      "projectOwner": user[0]?.user_id,
      "projectCreator": result.data[0]?.projectCreator,
      "projectApprover": result.data[0]?.projectApprover,
      "description": result.data[0]?.description,
      "documentation": result.data[0]?.documentation,
      "hash_documentation": result.data[0]?.hash_documentation,
      "state": "aposentado",
      "area": result.data[0]?.area,
      "creditAssigned": result.data[0]?.creditAssigned,
      "updateDate": String(current)
    };


    (async () => {
      await Swal.fire({
        title: 'Aposentar o crédito de carbono ?',
        icon: 'question',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Sim',
        denyButtonText: 'Não',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        }
      }).then((result) => {
        if (result.isConfirmed) {

          const block1 = {
            "account": String(user[0].user_id),
            "id": 1,
            "value": String(saldoCarbono)
          };

          exeAposentar(block1, block2);

        } else if (result.isDenied) {
          Falha.fire({
            icon: 'error',
            title: 'Carbono não aposentado'
          });
        }
      })
    })()
  }

  async function comprarCredito(project_id, vendedor, credito) {
    var moeda = credito * taxas.moeda;
    moeda = parseFloat(moeda);
    var profile = user[0].profile;
    var comprador = user[0].user_id;

    Swal.fire({
      title: 'Você deseja realizar a compra?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Sim',
      denyButtonText: `Não`,
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        if (profile === "comprador") {
          if (saldoMoeda > moeda) {
            exeTransfer(vendedor, comprador, credito, moeda, project_id);
          } else {
            Swal.fire('Sem saldo para adquirir o crédito!', '', 'error');
          }
        } else {
          Swal.fire('Somente usuários com perfil de "Comprador" pode adquirir crédito!', '', 'error');
        }

      } else if (result.isDenied) {
        Swal.fire('Compra cancelada!!!', '', 'info')
      }
    })
  }

  useEffect(() => {
    var address = localStorage.getItem('wallet');
    var user_data = JSON.parse(address);

    if (user_data[0].profile === 'registrador' ||  user_data[0].profile === 'certificador' ||  user_data[0].profile === 'comprador') {
      setUser(JSON.parse(address));
      getTaxas();
      getProjetos();
      getSaldos(JSON.parse(address));
    } else {
        navigate("/Erro");
    }

  }, [navigate]);

  return (
    <div>
      <Header key="header" />
      <Sidenav key="sidenav"/>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Prataforma</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner">
                    <p>Saldo de crédito de Carbono</p>
                    <h3>{saldoCarbono.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</h3>

                  </div>
                  <div className="icon">
                    <i className="ion ion-leaf" />
                  </div>
                  {/* <a href="#" className="small-box-footer" onClick="">
                    Aposentar crédito carbono <i className="fas fa-arrow-circle-right"></i>
                  </a> */}
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <p>Saldo Moeda</p>
                    <h3>{saldoMoeda.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</h3>

                  </div>
                  <div className="icon">
                    <i className="ion ion-cash" />
                  </div>
                  {/* <a href="/" className="small-box-footer">
                    Ver transações <i className="fas fa-arrow-circle-right"></i>
                  </a> */}
                </div>
              </div>
            </div>
            <table className="blueTable">
              <thead>
                <tr>
                  <th><center>Transação</center></th>
                  <th><center>Nome do projeto</center></th>
                  <th><center>Proprietário</center></th>
                  <th><center>Criador</center></th>
                  <th><center>Estado</center></th>
                  <th><center>Crédito</center></th>
                  <th><center>Operação</center></th>
                </tr>
              </thead>
              <tbody>
              {projetos.map((data) => {
                var valor = data.creditAssigned;
                valor = parseFloat(valor);
                valor = valor.toLocaleString('pt-br', { minimumFractionDigits: 2 });

                var visible = true;
                var adquirir = true;
                var aposentar = false;
                var aposentado = false;
                var perfil = true;
                
                if (data.projectOwner === "0x0000000000000000000000000000000000000000" || data.state === "enviado" || data.state === "rascunho" || data.state === "rejeitado"){
                  visible = false;
                }

                if (user[0].profile === 'certificador'){
                  perfil = false;
                }

                if (data.state === "adquirido" || data.state === "aposentado" || data.state === "enviado" ){
                  adquirir = false;
                }

                if (data.state === "adquirido"){
                  aposentar = true;
                }

                if (data.state === "aposentado"){
                  aposentado = true;
                }

               
                  return (
                    
                  <tr  style={{ cursor: "pointer" }}>
                    {visible === true &&
                      <>
                      <td key={data.id} onClick={() => ViewTransaction(data.id)}><center>{data.id}</center></td>
                      <td key={data.name} onClick={() => viewProjeto(data.id)}><center>{data.name}</center></td>
                      <td key={Math.random()} onClick={() => viewUser(data.projectOwner)}><center>{data.projectOwner}</center></td>
                      <td key={Math.random()} onClick={() => viewUser(data.projectCreator)}><center>{data.projectCreator}</center></td>
                      <td key={Math.random()}><center>{data.state}</center></td>
                      <td key={Math.random()}><center>{valor}</center></td>
                      <td key={Math.random()}><center><div>

                      {adquirir === true &&
                      <>
                      {perfil === true &&
                        <Button className="btn btn-default" variant="primary" size="sm" name="teste" onClick={() => comprarCredito(data.id, data.projectOwner, data.creditAssigned)}> <i class="ion ion-bag"></i> Comprar</Button>
                      }
                        <Button className="btn btn-default" variant="success" size="sm" onClick={() => resumoProjeto(data.id)}><i class="fas fa-glasses"></i> Visualizar</Button>
                      </>
                      }

                      {aposentar === true &&
                      <>
                      {perfil === true &&
                      <Button className="btn btn-default" variant="danger" size="sm" name="teste" onClick={() => aposentarCredito(data.id, data.creditAssigned)}><i class="ion ion-pie-graph"></i> Aposentar</Button>
                      }
                      <Button className="btn btn-default" variant="success" size="sm" onClick={() => resumoProjeto(data.id)}><i class="fas fa-glasses"></i> Visualizar</Button>
                      </>
                      } 

                      {aposentado === true &&
                      <Button className="btn btn-default" variant="success" size="sm" onClick={() => resumoProjeto(data.id)}><i class="fas fa-glasses"></i> Visualizar</Button>
                      }
                      </div></center></td>
                      </>
                    }    
                  </tr>
                  );
              })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
      <ModalViewProject  items={items} itemsTransactions={itemsTransactions} setShowModalViewProject={setShowModalViewProject} onClose={() => setShowModalViewProject(false)} show={showModalViewProject}/>
      <Footer key="footer"/>
    </div>
  )
}