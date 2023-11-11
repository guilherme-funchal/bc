import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Plataforma from './Components/Plataforma';
import Administracao from './Components/Administracao';
import Projetos from './Components/Projetos';
import Tokens from './Components/Tokens';
import Transfer from './Components/Transfer';
import Dashboard from './Components/Dashboard';
import Logoff from './Components/Logoff';
import Erro from './Components/Erro';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router key="router">
        <Routes key="routes">
          <Route key="/" path="/" element={<App />} />
          <Route key="Plataforma" path="/Plataforma" element={<Plataforma />}  />
          <Route key="Tokens" path="/Tokens" element={<Tokens />}  />
          <Route key="Transfer" path="/Transfer" element={<Transfer />}  />
          <Route key="Administracao" path="/Administracao" element={<Administracao />} />
          <Route key="Dashboard" path="/Dashboard" element={<Dashboard />} />
          <Route key="Projetos" path="/Projetos" element={<Projetos />}  />
          <Route key="logoff" path="/logoff" element={<Logoff />}  />
          <Route key="Erro" path="/Erro" element={<Erro />}  />
        </Routes>
    </Router>
    
);


