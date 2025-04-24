import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import UsuarioConcesion from '../Pages/Usuarios/UsuarioConcesion';
import UsuarioProrroga from '../Pages/Usuarios/UsuarioProrroga';
import UsuarioPrecario from '../Pages/Usuarios/UsuarioPrecario';
import UsuarioPlano from '../Pages/Usuarios/UsuarioPlano';
import UsuarioDenuncia from '../Pages/Usuarios/UsuarioDenuncia';
import UsuarioCita from '../Pages/Usuarios/UsuarioCita';
import Login from '../Pages/Auth/Login';
import Register from '../Pages/Auth/Register';
import ForgotPassword from '../Pages/Auth/ForgotPassword';
// import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../Pages/Auth/AuthContext';
import UsuarioExpediente from '../Pages/Usuarios/UsuarioExpediente';
import CitasList from '../Pages/UsuariosSolicitudes/CitasList';
import ConfirmAccount from '../Pages/Auth/ConfirmAccount';
import ResetPassword from '../Pages/Auth/ResetPassword';
import ConcesionesList from '../Pages/UsuariosSolicitudes/ConcesionesList';
import ProrrogasList from '../Pages/UsuariosSolicitudes/ProrrogaList';
import PrecariosList from '../Pages/UsuariosSolicitudes/PrecariosList';
import ExpedientesList from '../Pages/UsuariosSolicitudes/ExpedienteList';
import PlanosList from '../Pages/UsuariosSolicitudes/PlanosList';
import MiPerfil from '../Pages/Auth/MiPerfil';

function AppRoutes() {
  // const isAuthenticated = !!localStorage.getItem('token');

  return (
    <AuthProvider>
    <Routes>
      {/* Rutas Publicas */}
      <Route path="/" element={<Home />} />
      <Route path="/usuario-denuncia" element={<UsuarioDenuncia />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users/confirm/:token" element={<ConfirmAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path='/mi-perfil' element={<MiPerfil/>}/>


      {/* Rutas Protegidas */}
      <Route path="/usuario-expediente" element={<UsuarioExpediente/>}/>
      <Route path="/usuario-cita" element={<UsuarioCita />}/>
      <Route path="/usuario-concesion" element={<UsuarioConcesion />}/>
      <Route path="/usuario-prorroga" element={<UsuarioProrroga />}/>
      <Route path="/usuario-precario" element={<UsuarioPrecario />}/>
      <Route path="/usuario-plano" element={<UsuarioPlano />}/>
      {/* <Route path="/mis-solicitudes" element={<UserRequests />}/> */}
      <Route path="/mis-citas" element={<CitasList />}/>
      <Route path="/mis-concesiones" element={<ConcesionesList />}/>
      <Route path="/mis-prorrogas" element={<ProrrogasList />}/>
      <Route path="/mis-precarios" element={<PrecariosList />}/>
      <Route path="/mis-expedientes" element={<ExpedientesList />}/>
      <Route path="/mis-planos" element={<PlanosList />}/>

    </Routes>
            
   </AuthProvider>
  );
}

export default AppRoutes;
