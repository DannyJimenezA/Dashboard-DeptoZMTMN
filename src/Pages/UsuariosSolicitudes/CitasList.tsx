import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { isWednesday } from 'date-fns';
import Navbar from '../../Components/Navbar';
import { CalendarIcon, TrashIcon, XCircleIcon, CheckCircleIcon } from 'lucide-react';
import ApiRoutes from '../../Components/ApiRoutes';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface User {
  id: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
  email: string;
  password: string;
  isActive: boolean;
}

interface HoraCita {
  id: number;
  hora: string;
  disponibilidad: boolean;
}

interface AvailableDate {
  id: number;
  date: string;
  horasCita: HoraCita[];
}

interface Appointment {
  id: number;
  description: string;
  status: string;
  user: User;
  availableDate: AvailableDate;
  horaCita:
  {id: number,
    hora: string,
    disponibilidad: boolean,
  };
}


const CitasList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointmentId, setEditingAppointmentId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(ApiRoutes.citas.miscitas, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Datos recibidos de la API:", response.data); 

        if (!Array.isArray(response.data)) {
          throw new Error('La respuesta del backend no es un array válido.');
        }

        const adjustedAppointments = response.data.map((appointment: Appointment) => {
          if (!appointment.availableDate?.date) {
            console.warn('Cita sin fecha:', appointment);
            return {
              ...appointment,
              adjustedDate: null,
            };
          }

          const zonedDate = toZonedTime(parseISO(appointment.availableDate.date), 'America/Costa_Rica');
          return {
            ...appointment,
            adjustedDate: zonedDate,
          };
        });

        setAppointments(adjustedAppointments);
      } catch (error) {
        setError('Error al cargar las citas. Por favor, intente nuevamente.');
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(ApiRoutes.fechaDisponible, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setAvailableDates(response.data);
        } else {
          console.error("El backend no devolvió un array. Respuesta recibida:", response.data);
        }
      } catch (error) {
        console.error('Error al obtener fechas disponibles:', error);
        setError('Error al cargar las fechas disponibles.');
      }
    };

    fetchAvailableDates();
  }, [navigate]);

  const handleDateChange = async (selectedDate: Date | null) => {
    setSelectedDate(selectedDate);
    setSelectedTime(''); // Limpiar la hora seleccionada al cambiar la fecha

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Formatear la fecha como 'YYYY-MM-DD'

      // Buscar la fecha seleccionada en las fechas disponibles
      const selectedDateData = availableDates.find(
        (availableDate) => availableDate.date === formattedDate
      );

      if (selectedDateData) {
        // Filtrar las horas disponibles (disponibilidad: true)
        const horasDisponibles = selectedDateData.horasCita
          .filter((hora) => hora.disponibilidad)
          .map((hora) => hora.hora);

        setAvailableHours(horasDisponibles); // Actualizar las horas disponibles
      } else {
        setAvailableHours([]); // No hay horas disponibles para esta fecha
      }
    } else {
      setAvailableHours([]); // Limpiar las horas disponibles si no hay fecha seleccionada
    }
  };

  const handleCreateAppointment = () => {
    navigate('/usuario-cita');
  };

  const handleSaveClick = async (appointmentId: number) => {
    if (!availableHours.includes(selectedTime)) {
      setError("La hora seleccionada no está disponible.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const appointmentToUpdate = appointments.find((app) => app.id === appointmentId);
      if (!appointmentToUpdate) {
        setError("Cita no encontrada.");
        return;
      }

      const updatedAppointment = {
        description,
        availableDate: {
          id: appointmentToUpdate.availableDate.id,
          date: selectedDate ? formatInTimeZone(selectedDate, "America/Costa_Rica", "yyyy-MM-dd'T'HH:mm:ss") : '',
          horasCita: appointmentToUpdate.availableDate.horasCita, // Incluir horasCita
        },
        time: selectedTime, // Asegúrate de incluir la hora actualizada
      };

      const response = await axios.put(
        `${ApiRoutes.citas.crearcita}/${appointmentId}`,
        updatedAppointment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, ...updatedAppointment }
              : appointment
          )
        );
        setEditingAppointmentId(null);
        setError(null);
      }
    } catch (error) {
      setError("Hubo un error al actualizar la cita.");
      console.error("Error al actualizar la cita:", error);
    }
  };

  // const handleDeleteAppointment = async (id: number) => {
  //   if (!window.confirm('¿Está seguro que desea eliminar esta cita?')) {
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       navigate('/login');
  //       return;
  //     }

  //     await axios.delete(`${ApiRoutes.citas.miscitas}/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
  //   } catch (error) {
  //     setError('Error al eliminar la cita. Por favor, intente nuevamente.');
  //     console.error('Error deleting appointment:', error);
  //   }
  // };
  const handleDeleteAppointment = async (id: number) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la cita permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      await axios.delete(`${ApiRoutes.citas.miscitas}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
    } catch (error) {
      setError('Error al eliminar la cita. Por favor, intente nuevamente.');
      console.error('Error deleting appointment:', error);
    }
  };
  

  const handleCancelClick = () => {
    setEditingAppointmentId(null);
    setSelectedDate(null);
    setSelectedTime('');
    setDescription('');
    setError(null);
  };

  const filterWeekdays = (date: Date) => {
    return date && isWednesday(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
          <button
            onClick={handleCreateAppointment}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Agendar Cita
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* <div className="grid gap-6"> */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">

          {appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No se encontraron citas programadas</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow">
                {editingAppointmentId === appointment.id ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Descripción de la cita</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full min-h-[100px] rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Fecha</label>
                        <div className="relative">
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            filterDate={filterWeekdays}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Selecciona una fecha"
                            minDate={new Date()}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      {selectedDate && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Hora</label>
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Seleccione una hora</option>
                            {availableHours.length === 0 ? (
                              <option value="" disabled>No hay horas disponibles</option>
                            ) : (
                              availableHours.map((hora) => (
                                <option key={hora} value={hora}>
                                  {hora}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                      )}
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={handleCancelClick}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveClick(appointment.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{appointment.description}</h3>
                        <div className="space-y-1 text-sm text-gray-500">
                          <p>
                            Fecha:{' '}
                            {formatInTimeZone(
                              parseISO(appointment.availableDate.date),
                              'America/Costa_Rica',
                              'yyyy-MM-dd'
                            )}
                          </p>
                          {/* <p>Hora: {appointment.time}</p> */}
                          {/* <p>Hora: {appointment.availableDate?.horasCita?.hora}</p> */}
                          {/* <p>Hora: {appointment.availableDate?.horasCita?.[0]?.hora ?? 'No disponible'}</p> */}
                          <p>Hora: {appointment?.horaCita?.hora || "No disponible"}</p>



                          {/* <p className="flex items-center gap-1">
                            Estado:
                            <span
                              className={`inline-flex items-center ${
                                appointment.status === 'Aprobada'
                                  ? 'text-green-600'
                                  : appointment.status === 'Denegada'
                                  ? 'text-red-600'
                                  : 'text-yellow-600'
                              }`}
                            >
                              {appointment.status === 'confirmed' ? (
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                              ) : (
                                <XCircleIcon className="h-4 w-4 mr-1" />
                              )}
                              {appointment.status}
                            </span>
                          </p> */}
                                          <p className="flex items-center gap-1 mt-4">
                  Estado:
                  <span className={`inline-flex items-center ${appointment.status === 'Aprobada' ? 'text-green-600' :
                      appointment.status === 'Denegada' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                    {appointment.status === 'Aprobada' && (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    {appointment.status === 'Denegada' && (
                      <XCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    {appointment.status === 'Pendiente' && (
                      <span className="inline-block w-4 h-4 border-2 border-yellow-500 rounded-full mr-1"></span>
                    )}
                    {appointment.status}
                  </span>
                </p>
                        </div>
                      </div>
                                            <div className="flex gap-2">
                        {appointment.status !== 'Aprobada' && appointment.status !== 'Denegada' && (
                          <button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CitasList;