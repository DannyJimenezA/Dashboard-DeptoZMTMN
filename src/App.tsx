import './App.css'
import {BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './Components/Routes'
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    document.documentElement.classList.remove("dark"); // Remueve modo oscuro si existe
    document.documentElement.style.backgroundColor = "white"; // Fondo blanco
    document.documentElement.style.color = "black"; // Texto negro
  }, []);

  return (
    <Router>
        <AppRoutes/>
    </Router>
  )
}

export default App
