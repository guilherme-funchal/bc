import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';


export default function Erro() {
    
    
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
                                <h1 className="m-0">Erro</h1>
                                <div className="container-fluid">
                                  <br></br>
                                  Você não tem permissão de acessar está página!!!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        
                    </div>{/* /.container-fluid */}
                </section>
            </div>
            <Footer />
        </div>
    )
}