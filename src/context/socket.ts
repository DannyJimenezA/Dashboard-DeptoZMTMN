// src/context/socket.ts
import { io } from 'socket.io-client';
import ApiRoutes from '../Components/ApiRoutes';

export const socket = io(ApiRoutes.urlBase, {
  transports: ['websocket'],
  auth: {
    token: localStorage.getItem('token'),
  },
});
