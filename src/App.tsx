import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Components/Routes';
import { useEffect } from 'react';

// 🔥 Importar Contexts y SocketListener
import { SolicitudesProvider } from './context/SolicitudesContext';
import { SolicitudesGraficasProvider } from './context/SolicitudesGraficasContext'; // 👈 Nuevo
import SocketListener from './context/SocketListener';

function App() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.backgroundColor = 'white';
    document.documentElement.style.color = 'black';
  }, []);

  return (
    <SolicitudesProvider>
      <SolicitudesGraficasProvider> {/* 👈 Envolvemos aquí también */}
        <Router>
          <SocketListener /> {/* Escucha WebSocket */}
          <AppRoutes />      {/* Tus Rutas */}
        </Router>
      </SolicitudesGraficasProvider>
    </SolicitudesProvider>
  );
}

export default App;
