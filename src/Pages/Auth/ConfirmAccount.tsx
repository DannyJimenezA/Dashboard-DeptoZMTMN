// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios, { AxiosError } from 'axios';
// import ApiRoutes from '../../Components/ApiRoutes';
// import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// const ConfirmAccount = () => {
//   const { token } = useParams<{ token: string }>();
//   const [message, setMessage] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);
//   const [success, setSuccess] = useState<boolean>(false);
//   const [countdown, setCountdown] = useState<number>(10); // ⏱️ 10 segundos

//   useEffect(() => {
//     const confirmAccount = async () => {
//       try {
//         if (!token) {
//           setMessage('El token no fue proporcionado.');
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(`${ApiRoutes.urlBase}/users/confirm/${token}`);
//         setMessage(response.data.message || 'Cuenta confirmada con éxito.');
//         setSuccess(true);
//       } catch (error) {
//         const err = error as AxiosError<{ message: string }>;
//         if (err.response?.data?.message) {
//           setMessage(err.response.data.message);
//         } else if (error instanceof Error) {
//           setMessage(`Error inesperado: ${error.message}`);
//         } else {
//           setMessage('Error al conectar con el servidor.');
//         }
//         setSuccess(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     confirmAccount();
//   }, [token]);

//   // ⏳ Lógica de contador y cierre automático
//   useEffect(() => {
//     if (!loading && success) {
//       const interval = setInterval(() => {
//         setCountdown(prev => {
//           if (prev === 1) {
//             clearInterval(interval);
//             window.close(); // 🔒 Cierra la pestaña automáticamente
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [loading, success]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
//         {loading ? (
//           <>
//             <div className="animate-spin mx-auto mb-4 h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//             <h2 className="text-lg font-semibold text-gray-700">Activando cuenta, por favor espera...</h2>
//           </>
//         ) : (
//           <>
//             {success ? (
//               <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
//             ) : (
//               <ExclamationCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             )}

//             <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>

//             {success && (
//               <p className="mt-4 text-sm text-gray-500">
//                 Esta ventana se cerrará automáticamente en{' '}
//                 <span className="font-semibold text-blue-600">{countdown}</span> segundos.
//               </p>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ConfirmAccount;
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import ApiRoutes from '../../Components/ApiRoutes';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ConfirmAccount = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10);

  // 🔍 Validar token al montar
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (!token) {
          setMessage('El token no fue proporcionado.');
          setLoading(false);
          return;
        }

        await axios.get(`${ApiRoutes.urlBase}/users/confirm/validate?token=${token}`);
        setTokenValid(true);
        setMessage('Token válido. Por favor confirma tu cuenta.');
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        setMessage(err.response?.data?.message || 'Error al validar el token.');
        setTokenValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  // ✅ Confirmar cuenta manualmente
  const handleConfirm = async () => {
    try {
      const res = await axios.post(`${ApiRoutes.urlBase}/users/confirm`, { token });
      setMessage(res.data.message || 'Cuenta confirmada con éxito.');
      setConfirmed(true);
      setTokenValid(false); // Ocultamos el botón
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage(err.response?.data?.message || 'Error al confirmar la cuenta.');
      setConfirmed(false);
    }
  };

  // ⏱️ Iniciar cuenta regresiva para cerrar ventana si se confirmó
  useEffect(() => {
    if (confirmed) {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            clearInterval(interval);
            window.close();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [confirmed]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
        {loading ? (
          <>
            <div className="animate-spin mx-auto mb-4 h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-700">Validando token, por favor espera...</h2>
          </>
        ) : (
          <>
            {confirmed ? (
              <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
            ) : (
              <ExclamationCircleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            )}

            <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>

            {tokenValid && (
              <button
                onClick={handleConfirm}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmar cuenta
              </button>
            )}

            {confirmed && (
              <p className="mt-4 text-sm text-gray-500">
                Esta ventana se cerrará automáticamente en{' '}
                <span className="font-semibold text-blue-600">{countdown}</span> segundos.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmAccount;
