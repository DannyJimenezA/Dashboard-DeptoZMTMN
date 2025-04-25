// src/constants/permissions.ts

import UsersTable from '../Pages/Tablas/UsersTable';
import AppointmentTable from '../Pages/Tablas/AppointmentsTable.tsx';
import ConcesionesTable from '../Pages/Tablas/ConcesionesTable.tsx';
import DenunciasTable from '../Pages/Tablas/DenunciasTable.tsx';
import ExpedientesTable from '../Pages/Tablas/ExpedientesTable.tsx';
import PlanosTable from '../Pages/Tablas/PlanosTable.tsx';
import ProrrogasTable from '../Pages/Tablas/ProrrogasTable.tsx';
import RolesTable from '../Pages/Tablas/RolesTable.tsx';
import UsoPrecarioTable from '../Pages/Tablas/PrecariosTable.tsx';
import LugarDenunciaTable from '../Pages/Tablas/LugarDenunciaTable';
import TipoDenunciaTable from '../Pages/Tablas/TipoDenunciaTable';

export const ROUTES_WITH_PERMISSIONS = [
  {
    path: 'citas',
    name: 'Citas',
    component: AppointmentTable,
    requiredPermission: 'ver_citas',
  },
  {
    path: 'concesiones',
    name: 'Concesiones',
    component: ConcesionesTable,
    requiredPermission: 'ver_concesiones',
  },
  {
    path: 'prorrogas',
    name: 'Prórrogas',
    component: ProrrogasTable,
    requiredPermission: 'ver_prorrogas',
  },
  {
    path: 'denuncias',
    name: 'Denuncias',
    component: DenunciasTable,
    requiredPermission: 'ver_denuncia',
  },
  {
    path: 'expedientes',
    name: 'Expedientes',
    component: ExpedientesTable,
    requiredPermission: 'ver_copia_expediente',
  },
  {
    path: 'uso-precario',
    name: 'Uso Precario',
    component: UsoPrecarioTable,
    requiredPermission: 'ver_precario',
  },
  {
    path: 'planos',
    name: 'Planos',
    component: PlanosTable,
    requiredPermission: 'ver_revisionplano',
  },
  {
    path: 'usuarios',
    name: 'Usuarios',
    component: UsersTable,
    requiredPermission: 'ver_users',
  },
  {
    path: 'roles',
    name: 'Roles',
    component: RolesTable,
    requiredPermission: 'ver_roles',
  },
  {
    path: 'lugar-denuncia',
    name: 'Lugar Denuncia',
    component: LugarDenunciaTable,
    requiredPermission: 'ver_lugardenuncia',
  },
  {
    path: 'tipo-denuncia',
    name: 'Tipo Denuncia',
    component: TipoDenunciaTable,
    requiredPermission: 'ver_tipodenuncia',
  },
  
];
