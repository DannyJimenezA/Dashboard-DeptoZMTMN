import { User } from "./UserType";

export interface Appointment {
    id: number;
    description: string;
    date: string;    // Fecha en formato ISO string
    time: string;    // Hora en formato string
    status: string;  // Estado de la cita ('pending', 'completed', etc.)
    user: User;      // Relación con el usuario que creó la cita
  }
