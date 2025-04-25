// import React, { useState } from 'react';
// import { EnvelopeIcon } from '@heroicons/react/24/outline';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import ApiRoutes from '../../Components/ApiRoutes';

// export default function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);
//   const navigate = useNavigate();

//   // Define el origen (cambiar a "admin" o "user" según el proyecto)
//   const origin = "admin"; // o "admin" para el frontend de administradores

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       // Enviar solicitud de recuperación de contraseña con el parámetro `origin`
//       const response = await axios.post(`${ApiRoutes.usuarios}/forgot-password`, { email, origin});
//       setMessage(response.data.message);
//       setIsError(false);
//     } catch (error) {
//       // Manejo de errores
//       if (axios.isAxiosError(error) && error.response) {
//         setMessage(error.response.data.message);
//       } else {
//         setMessage('Error inesperado. Por favor, intente nuevamente.');
//       }
//       setIsError(true);
//     }
//   };

//   const handleBack = () => {
//     navigate('/'); // Redirige a la página principal o a otra ruta específica
//   };

//   return (
//     <div className="min-h-screen w-full bg-gray-50">
//       <div className="h-full w-full px-4 py-12 sm:px-6 lg:px-8">
//         <div className="w-full max-w-4xl mx-auto">
//           <div className="bg-white shadow-xl rounded-lg p-8">
//             <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
//               Olvido su Contraseña
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-8">
//               <div className="grid gap-6 md:grid-cols-1 lg:gap-8">
//                 <div>
//                   <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
//                     Ingrese su Correo electrónico
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//                     </div>
//                     <input
//                       id="email-address"
//                       name="email"
//                       type="email"
//                       autoComplete="email"
//                       required
//                       className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       placeholder="Ingrese su correo electrónico"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Recuperar Contraseña
//                 </button>
//               </div>
//               <button 
//                 onClick={handleBack} 
//                 className="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
//               >
//                 Volver
//               </button>
//             </form>
//             {message && (
//               <p className={`mt-4 text-center ${isError ? 'text-red-600' : 'text-green-600'}`}>
//                 {message}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApiRoutes from '../../Components/ApiRoutes';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null); // 👈 nuevo estado para contador
  const navigate = useNavigate();

  const origin = "user";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${ApiRoutes.usuarios}/forgot-password`, { email, origin });
      setMessage(response.data.message);
      setIsError(false);
      setCountdown(10); // Inicia el contador de 10 segundos después del mensaje
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error inesperado. Por favor, intente nuevamente.');
      }
      setIsError(true);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  // 🧠 Efecto para iniciar cuenta regresiva y redirigir
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      navigate('/login');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev ?? 1) - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="h-full w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Olvidó su Contraseña
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-1 lg:gap-8">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                    Ingrese su Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Ingrese su correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!!countdown} // ⛔ desactiva botón mientras cuenta
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${countdown ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Recuperar Contraseña
                </button>
              </div>
              <button
                onClick={handleBack}
                disabled={!!countdown}
                className="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
              >
                Volver
              </button>
            </form>

            {message && (
              <div className={`mt-6 text-center ${isError ? 'text-red-600' : 'text-green-600'}`}>
                <p>{message}</p>
                {!isError && countdown !== null && (
                  <p className="text-sm text-gray-500 mt-2">
                    Redirigiendo en <span className="font-semibold">{countdown}</span> segundos...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
