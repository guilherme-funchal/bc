import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap/';
import { useState, useEffect, useCallback } from 'react';
import ModalAddUser from './Modals/ModalAddUser';
import ModalEditUser from './Modals/ModalEditUser';
// import './../App.css';
import './Modals/Modal.css';


export default function Administracao() {
    async function viewUser(user_id) {
        var response = await Api.get('account/find/' + user_id);
        Swal.fire({
          title: response.data[0].name,
          text: response.data[0].email,
          imageUrl: response.data[0].image,
          imageAlt: 'Custom image',
        })
    }

    const getUsers = async () => {
        const response = await Api.get('account/list');
        setUsers(response.data);
    };
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);
    };

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-right',
        iconColor: 'green',
        customclassName: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
    });

    async function EditItemsUser(id) {
        var response = await Api.get('account/find/' + id);
        setItems(response.data);
    }

    async function editUser(id) {
        EditItemsUser(id);
        setShowModalEditUser(true);
    }

    async function delUsuario(user_id) {
        Swal.fire({
            title: 'Deseja excluir a conta?',
            text: "",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        }).then((result) => {
            if (result.isConfirmed) {
                Api.delete('account/' + user_id);
                Toast.fire({
                    icon: 'success',
                    title: 'Usuário excluído'
                });
                const block = {
                    "user_id": user_id
                };
                Api.post('account-lists/add', block);
            }
            getUsers();
            forceUpdate();
        })
    }

    const [users, setUsers] = useState([]);
    const [taxas, setTaxas] = useState([]);
    const [showModalAddUser, setShowModalAddUser] = useState(false);
    const forceUpdate = useCallback(() => updateState({}), []);
    const [, updateState] = useState();
    const [items, setItems] = useState([' ']);
    const [showModalEditUser, setShowModalEditUser] = useState(false);
      
    useEffect(() => {
        getUsers();
    }, []);

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
                                <h1 className="m-0">Usuários</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div style={{ "font-size": "15px" }} class="table-responsive">
                        {/* <table class="table-sm table-striped table-bordered  w-100 d-block d-md-table"> */}
                        <table className="blueTable">
                            <thead>
                                <tr>
                                    <th class="bg-primary"><center>Nome</center></th>
                                    <th class="bg-primary"><center>Email</center></th>
                                    <th class="bg-primary"><center>User ID</center></th>
                                </tr>
                            </thead>

                            {users.map((data) => {
                                var visible = false;
                                if (data.user_id === "0x0000000000000000000000000000000000000000"){
                                    visible = true;
                                }
                                return (
                                    visible ? null
                                    : (
                                    <tr> 
                                    <td><center>{data.name}</center></td>
                                    <td><center>{data.email}</center></td>
                                    <td><center>{data.user_id}</center></td> 
                                    </tr>
                                    )
                                );
                            })}
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    </div>
                </section>
                <div><br></br></div>
            </div>
            <ModalAddUser onClose={() => { getUsers(); forceUpdate(); setShowModalAddUser(false); setItems(' '); }} show={showModalAddUser} backdrop={"static"} toggle={toggle} keyboard={false}></ModalAddUser>
            <ModalEditUser items={items} onClose={() => { getUsers(); forceUpdate(); setShowModalEditUser(false); setItems(' '); }} show={showModalEditUser} toggle={toggle} keyboard={false}></ModalEditUser>
            
  
            {/* /.content-wrapper */}
            <Footer />
        </div>
    )
}