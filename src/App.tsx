// import './App.css'
// import {BrowserRouter as Router } from 'react-router-dom'
// import AppRoutes from './Components/Routes'
// import { useEffect } from 'react';

// function App() {

//   useEffect(() => {
//     document.documentElement.classList.remove("dark"); // Remueve modo oscuro si existe
//     document.documentElement.style.backgroundColor = "white"; // Fondo blanco
//     document.documentElement.style.color = "black"; // Texto negro
//   }, []);

//   return (
//     <Router>
//         <AppRoutes/>
//     </Router>
//   )
// }

// export default App

import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Components/Routes';
import { useEffect } from 'react';

// 🔥 Importar el Context y el SocketListener
import { SolicitudesProvider } from './context/SolicitudesContext';
import SocketListener from './context/SocketListener';

function App() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.backgroundColor = 'white';
    document.documentElement.style.color = 'black';
  }, []);

  return (
    // 👇 Este comentario debe ir FUERA
    <SolicitudesProvider>
      <Router>
        <SocketListener /> {/* 👈 Este escucha en todo momento */}
        <AppRoutes />
      </Router>
    </SolicitudesProvider>
  );
}

export default App;

