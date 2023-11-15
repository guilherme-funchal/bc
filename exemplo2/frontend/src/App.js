import './App.css';
import { useEffect } from 'react';
import Header from './Components/Header';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Sidenav from './Components/Sidenav';


export default function App() {

  useEffect(() => {
  }, [])

  return (
    <div className='App'>
      <Header />
      <Sidenav />
      <Home />      
      <Footer />
    </div>
  );
}

