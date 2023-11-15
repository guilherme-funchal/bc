import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Administracao from './Components/Administracao';
import Dashboard from './Components/Dashboard';
import Logoff from './Components/Logoff';
import Erro from './Components/Erro';
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router key="router">
        <Routes key="routes">
        <Route key="/" path="/" element={<App />} />
          <Route key="Administracao" path="/Administracao" element={<Administracao />} />
          <Route key="Dashboard" path="/Dashboard" element={<Dashboard />} />
          <Route key="logoff" path="/logoff" element={<Logoff />}  />
          <Route key="Erro" path="/Erro" element={<Erro />}  />
        </Routes>
    </Router>
    
);


