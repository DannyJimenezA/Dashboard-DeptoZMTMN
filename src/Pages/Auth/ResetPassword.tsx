// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
// import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
// import ApiRoutes from '../../Components/ApiRoutes';

// interface ErrorResponse {
//   message: string;
// }

// const ResetPassword = () => {
//   const query = new URLSearchParams(useLocation().search);
//   const token = query.get('token');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [countdown, setCountdown] = useState<number | null>(null);
//   const navigate = useNavigate();
//   const [loginResponded, setLoginResponded] = useState(false);


//   useEffect(() => {
//     if (!token) {
//       setMessage('Token de restablecimiento no válido o faltante.');
//     }
//   }, [token]);

//   const validatePassword = (password: string) => {
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//     return passwordRegex.test(password);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       setMessage('Las contraseñas no coinciden');
//       return;
//     }

//     if (!validatePassword(newPassword)) {
//       setMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await axios.post(`${ApiRoutes.usuarios}/reset-password`, {
//         token,
//         newPassword,
//       });

//       // setMessage(response.data.message || 'Contraseña restablecida con éxito');
//       // setCountdown(10); // ⏱ Iniciar cuenta regresiva de 10 segundos
//       setMessage(response.data.message || 'Contraseña restablecida con éxito');

// // 🔁 Avisar a otras pestañas
// localStorage.setItem('passwordResetSuccess', Date.now().toString());

// // Escuchar si una pestaña de login responde
// const responseListener = (event: StorageEvent) => {
//   if (event.key === 'loginTabReceived' && event.newValue === 'true') {
//     setLoginResponded(true);
//     window.close(); // ✅ Otra pestaña escuchó y se encargará → cerramos esta
//   }
// };

// window.addEventListener('storage', responseListener);

// // Esperar unos segundos para ver si otra pestaña responde
// setTimeout(() => {
//   window.removeEventListener('storage', responseListener);

//   if (!loginResponded) {
//     // 🔙 Si nadie respondió, redirigimos en esta misma pestaña
//     navigate('/');
//   }
// }, 3000); // Esperamos 3 segundos

//     } catch (error) {
//       const err = error as AxiosError<ErrorResponse>;
//       setMessage(err.response?.data.message || 'Error al restablecer la contraseña');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ⏳ Manejo del temporizador para cerrar la pestaña
//   useEffect(() => {
//     if (countdown === null) return;

//     if (countdown === 0) {
//       window.close(); // 🔒 Intenta cerrar la pestaña
//       return;
//     }

//     const timer = setTimeout(() => {
//       setCountdown(prev => (prev ?? 1) - 1);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [countdown]);

//   const renderInput = (
//     name: string,
//     label: string,
//     value: string,
//     setValue: (value: string) => void,
//     showPasswordToggle: boolean,
//     showPasswordState: boolean,
//     toggleShowPassword: () => void
//   ) => (
//     <div>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
//         {label}
//       </label>
//       <div className="relative">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//         </div>
//         <input
//           id={name}
//           name={name}
//           type={showPasswordToggle && showPasswordState ? 'text' : 'password'}
//           className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           placeholder={`Ingrese su ${label.toLowerCase()}`}
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//         />
//         {showPasswordToggle && (
//           <button
//             type="button"
//             onClick={toggleShowPassword}
//             className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
//           >
//             {showPasswordState ? (
//               <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
//             ) : (
//               <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
//             )}
//           </button>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen w-full bg-gray-50">
//       <div className="h-full w-full px-4 py-12 sm:px-6 lg:px-8">
//         <div className="w-full max-w-2xl mx-auto">
//           <div className="bg-white shadow-xl rounded-lg p-8">
//             <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
//               Restablecer Contraseña
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {renderInput(
//                 'newPassword',
//                 'Nueva Contraseña',
//                 newPassword,
//                 setNewPassword,
//                 true,
//                 showPassword,
//                 () => setShowPassword(!showPassword)
//               )}
//               {renderInput(
//                 'confirmPassword',
//                 'Confirmar Nueva Contraseña',
//                 confirmPassword,
//                 setConfirmPassword,
//                 true,
//                 showConfirmPassword,
//                 () => setShowConfirmPassword(!showConfirmPassword)
//               )}

//               {message && (
//                 <div className={`text-center mt-4 text-sm ${message.toLowerCase().includes('éxito') || message.toLowerCase().includes('exito') ? 'text-green-600' : 'text-red-600'}`}>
//                   <p>{message}</p>
//                   {!isSubmitting && countdown !== null && !message.toLowerCase().includes('error') && (
//                     <p className="mt-2 text-gray-500">
//                       Esta pestaña se cerrará automáticamente en <strong>{countdown}</strong> segundos...
//                     </p>
//                   )}
//                 </div>
//               )}

//               <div>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting || !token}
//                   className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
//                     isSubmitting
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
//                   }`}
//                 >
//                   {isSubmitting ? 'Procesando...' : 'Restablecer Contraseña'}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => navigate('/')}
//                   disabled={!!countdown}
//                   className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//                 >
//                   Volver
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
// export default ResetPassword;

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface ErrorResponse {
  message: string;
}

const ResetPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const navigate = useNavigate();
  const [loginResponded, setLoginResponded] = useState(false);
  const MySwal = withReactContent(Swal);


  useEffect(() => {
    if (!token) {
      setMessage('Token de restablecimiento no válido o faltante.');
    }
  }, [token]);

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };
  // ⏳ Manejo del temporizador para cerrar la pestaña
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    await MySwal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden.',
      confirmButtonColor: '#ef4444',
    });
    return;
  }

  if (!validatePassword(newPassword)) {
    await MySwal.fire({
      icon: 'warning',
      title: 'Contraseña inválida',
      text: 'Debe tener al menos 8 caracteres, incluyendo una letra y un número.',
      confirmButtonColor: '#f59e0b',
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const response = await axios.post(`${ApiRoutes.usuarios}/reset-password`, {
      token,
      newPassword,
    });

    await MySwal.fire({
      icon: 'success',
      title: '¡Contraseña actualizada!',
      text: response.data.message || 'Contraseña restablecida con éxito.',
      timer: 3000,
      showConfirmButton: false,
    });

    // 🔁 Avisar a otras pestañas
    localStorage.setItem('passwordResetSuccess', Date.now().toString());

    // Escuchar si una pestaña de login responde
    const responseListener = (event: StorageEvent) => {
      if (event.key === 'loginTabReceived' && event.newValue === 'true') {
        setLoginResponded(true);
        window.close();
      }
    };

    window.addEventListener('storage', responseListener);

    setTimeout(() => {
      window.removeEventListener('storage', responseListener);
      if (!loginResponded) {
        navigate('/login');
      }
    }, 3000);

  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    const errorMessage = err.response?.data.message || 'Error al restablecer la contraseña';

    await MySwal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#ef4444',
    });
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      window.close(); // 🔒 Intenta cerrar la pestaña
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => (prev ?? 1) - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const renderInput = (
    name: string,
    label: string,
    value: string,
    setValue: (value: string) => void,
    showPasswordToggle: boolean,
    showPasswordState: boolean,
    toggleShowPassword: () => void,
    maxLength?: number // 👈 parámetro opcional
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          id={name}
          name={name}
          type={showPasswordToggle && showPasswordState ? 'text' : 'password'}
          className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={`Ingrese su ${label.toLowerCase()}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength} // 👈 aplicado aquí
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
          >
            {showPasswordState ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            )}
          </button>
        )}
      </div>
    </div>
  );


  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="h-full w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Restablecer Contraseña
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderInput(
                'newPassword',
                'Nueva Contraseña',
                newPassword,
                setNewPassword,
                true,
                showPassword,
                () => setShowPassword(!showPassword),
                25
              )}
              {renderInput(
                'confirmPassword',
                'Confirmar Nueva Contraseña',
                confirmPassword,
                setConfirmPassword,
                true,
                showConfirmPassword,
                () => setShowConfirmPassword(!showConfirmPassword),
                25
              )}

{!isSubmitting && countdown !== null && (
  <p className="mt-6 text-center text-sm text-gray-500">
    Esta pestaña se cerrará automáticamente en <strong>{countdown}</strong> segundos...
  </p>
)}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                  {isSubmitting ? 'Procesando...' : 'Restablecer Contraseña'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  disabled={!!countdown}
                  className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Volver
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
