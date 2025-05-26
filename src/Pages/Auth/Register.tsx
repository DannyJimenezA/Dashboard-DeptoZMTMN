// import React, { useState } from 'react';
// import {
//   EnvelopeIcon,
//   IdentificationIcon,
//   UserIcon,
//   LockClosedIcon,
//   EyeIcon,
//   EyeSlashIcon,
// } from '@heroicons/react/24/outline';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ApiRoutes from '../../Components/ApiRoutes';
// import withReactContent from 'sweetalert2-react-content';
// import Swal from 'sweetalert2';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     email: '',
//     cedula: '',
//     nombre: '',
//     apellido1: '',
//     apellido2: '',
//     telefono: '',
//     telefonoPrefijo: '',
//     password: '',
//     confirmPassword: '',
//     origin: 'user',
//   });

//   const [tipoIdentificacion, setTipoIdentificacion] = useState<'nacional' | 'residente' | 'extranjero'>('nacional');
//   const [tipoTelefono, setTipoTelefono] = useState<'nacional' | 'extranjero'>('nacional');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [, setErrorMessage] = useState('');
//   const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const MySwal = withReactContent(Swal);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const validateField = (name: string, value: string): string => {
//     const onlyLetters = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
//     const onlyLettersNoSpace = /^[A-Za-z]+$/;
//     const onlyNumbers = /^[0-9]+$/;
//     const phoneInternational = /^[1-9]{1}[0-9]{1,2}$/;
//     const phoneNumber = /^[0-9]{7,12}$/;
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

//     switch (name) {
//       case 'nombre':
//         if (!onlyLetters.test(value)) return 'Solo letras y un espacio opcional';
//         break;
//       case 'apellido1':
//       case 'apellido2':
//         if (!onlyLettersNoSpace.test(value)) return 'Solo letras sin espacios';
//         break;
//       case 'cedula':
//         if (tipoIdentificacion === 'nacional') {
//           if (!/^\d{9}$/.test(value)) return 'Cédula nacional debe tener 9 dígitos';
//         } else if (tipoIdentificacion === 'residente') {
//           if (!/^\d{11,12}$/.test(value)) return 'DIMEX debe tener entre 11 y 12 dígitos';
//         } else if (tipoIdentificacion === 'extranjero') {
//           if (!/^[a-zA-Z0-9]{6,20}$/.test(value)) return 'Pasaporte debe tener entre 6 y 20 caracteres alfanuméricos';
//         }
//         break;
//       case 'telefono':
//         if (tipoTelefono === 'nacional') {
//           if (!onlyNumbers.test(value) || value.length !== 8)
//             return 'Debe tener exactamente 8 dígitos';
//         } else {
//           if (!phoneNumber.test(value)) return 'Número debe tener entre 7 y 12 dígitos';
//         }
//         break;
//       case 'telefonoPrefijo':
//         if (tipoTelefono === 'extranjero' && !phoneInternational.test(value))
//           return 'Prefijo inválido (1 a 3 dígitos)';
//         break;
//       case 'email':
//         if (!value.includes('@')) return 'Correo inválido';
//         break;
//       case 'password':
//         if (!passwordRegex.test(value))
//           return 'Mínimo 8 caracteres, una letra y un número';
//         break;
//       case 'confirmPassword':
//         if (!passwordRegex.test(value))
//           return 'Mínimo 8 caracteres, una letra y un número';
//         if (value !== formData.password)
//           return 'Las contraseñas no coinciden';
//         break;
//       default:
//         break;
//     }

//     return '';
//   };
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   setErrorMessage('');
//   setIsSubmitting(true);

//   const newErrors: { [key: string]: string } = {};
//   Object.entries(formData).forEach(([key, value]) => {
//     const error = validateField(key, value);
//     if (error) newErrors[key] = error;
//   });

//   if (formData.password !== formData.confirmPassword) {
//     await MySwal.fire({
//       icon: 'error',
//       title: 'Contraseñas no coinciden',
//       text: 'Asegúrate de que ambas contraseñas sean iguales.',
//       confirmButtonColor: '#ef4444',
//     });

//     setFieldErrors(prev => ({
//       ...prev,
//       confirmPassword: 'Las contraseñas no coinciden',
//     }));

//     setIsSubmitting(false);
//     return;
//   }

//   if (Object.keys(newErrors).length > 0) {
//     setFieldErrors(newErrors);
//     await MySwal.fire({
//       icon: 'error',
//       title: 'Error de Validación',
//       text: 'Corrige los campos marcados antes de continuar.',
//       confirmButtonColor: '#ef4444',
//     });

//     setIsSubmitting(false);
//     return;
//   }

//   // ✅ Generar el número de teléfono con formato correcto
//   const telefonoFinal =
//     tipoTelefono === 'nacional'
//       ? `+506-${formData.telefono}`
//       : `+${formData.telefonoPrefijo}-${formData.telefono}`;

//   // ✅ Agregar prefijo a la cédula
//   let cedulaFinal = formData.cedula.trim();
//   if (tipoIdentificacion === 'nacional') {
//     cedulaFinal = `CR-${cedulaFinal}`;
//   } else if (tipoIdentificacion === 'residente') {
//     cedulaFinal = `RES-${cedulaFinal}`;
//   } else {
//     cedulaFinal = `PAS-${cedulaFinal}`;
//   }

//   // ✅ Crear objeto con datos finales
//   const dataToSend = {
//     ...formData,
//     cedula: cedulaFinal,
//     telefono: telefonoFinal,
//   };

//   try {
//     const response = await axios.post(`${ApiRoutes.usuarios}/register`, dataToSend);

//     await MySwal.fire({
//       icon: 'success',
//       title: '¡Registro Exitoso!',
//       text: response.data.message || 'Usuario registrado correctamente. Revisa tu correo electrónico.',
//       confirmButtonText: 'Ir al inicio de sesión',
//       confirmButtonColor: '#2563eb',
//     });

//     navigate('/');
    
//   } catch (error) {
//     let mensaje = 'Error de conexión con el servidor';
//     if (axios.isAxiosError(error) && error.response) {
//       mensaje = error.response.data.message || 'Error en el registro';
//     }

//     await MySwal.fire({
//       icon: 'error',
//       title: '¡Ups!',
//       text: mensaje,
//       confirmButtonColor: '#ef4444',
//     });

//     setIsSubmitting(false);
//   }
// };

//   const handleBack = () => navigate('/');


//   const renderInput = (
//     name: string,
//     label: string,
//     type: string,
//     icon: React.ReactNode,
//     showPasswordToggle = false,
//     passwordToggleValue?: boolean,
//     setPasswordToggleValue?: (value: boolean) => void,
//     maxLength?: number,
//     minLength?: number
//   ) => (
//     <div>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
//         {label}
//       </label>
//       <div className="relative">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           {icon}
//         </div>
//         <input
//           id={name}
//           name={name}
//           type={showPasswordToggle && passwordToggleValue ? 'text' : type}
//           required
//           maxLength={maxLength}
//           minLength={minLength}
//           inputMode={type === 'tel' ? 'numeric' : undefined}
//           className={`appearance-none block w-full px-3 py-3 pl-10 border ${fieldErrors[name] ? 'border-red-500' : 'border-gray-300'
//             } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//           placeholder={`Ingrese su ${label.toLowerCase()}`}
//           value={formData[name as keyof typeof formData]}
//           onChange={handleChange}
//         />
//         {showPasswordToggle && setPasswordToggleValue && (
//           <button
//             type="button"
//             onClick={() => setPasswordToggleValue(!passwordToggleValue)}
//             className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
//           >
//             {passwordToggleValue ? (
//               <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
//             ) : (
//               <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
//             )}
//           </button>
//         )}
//       </div>
//       {fieldErrors[name] && (
//         <p className="mt-1 text-sm text-red-500">{fieldErrors[name]}</p>
//       )}
//     </div>
//   );


//   return (
//     <div className="min-h-screen w-full bg-gray-50">
//       <div className="h-full w-full px-4 py-12 sm:px-6 lg:px-8">
//         <div className="w-full max-w-4xl mx-auto">
//           <div className="bg-white shadow-xl rounded-lg p-8">
//             <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
//               Registro de Usuario
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//               <div className="grid gap-6 md:grid-cols-2">
//                 {/* Nombre y apellidos */}
//                 {['nombre', 'apellido1', 'apellido2'].map(field => (
//                   <div key={field}>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {field === 'nombre' ? 'Nombre' : field === 'apellido1' ? 'Primer apellido' : 'Segundo apellido'}
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <UserIcon className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         type="text"
//                         name={field}
//                         value={formData[field as keyof typeof formData]}
//                         onChange={handleChange}
//                         placeholder={
//                           field === 'nombre'
//                             ? 'Ingrese su nombre'
//                             : field === 'apellido1'
//                               ? 'Ingrese su primer apellido'
//                               : 'Ingrese su segundo apellido'
//                         }
//                         className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md text-gray-900 sm:text-sm"
//                         maxLength={30}
//                         required
//                       />
//                     </div>
//                     {fieldErrors[field] && (
//                       <p className="mt-1 text-sm text-red-500">{fieldErrors[field]}</p>
//                     )}
//                   </div>
//                 ))}

//                 {/* Correo electrónico */}
//                 {renderInput('email', 'Correo electrónico', 'email', <EnvelopeIcon className="h-5 w-5 text-gray-400" />)}

//                 {/* Tipo de identificación */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Identificación</label>
//                   <select
//                     value={tipoIdentificacion}
//                     onChange={(e) => setTipoIdentificacion(e.target.value as any)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 sm:text-sm"
//                   >
//                     <option value="nacional">Cédula Nacional</option>
//                     <option value="residente">DIMEX (Residente)</option>
//                     <option value="extranjero">Pasaporte (Extranjero)</option>
//                   </select>
//                 </div>

//                 {/* Cedula */}
//                 {renderInput(
//                   'cedula',
//                   tipoIdentificacion === 'nacional'
//                     ? 'Cédula Nacional'
//                     : tipoIdentificacion === 'residente'
//                       ? 'DIMEX'
//                       : 'Pasaporte',
//                   'text',
//                   <IdentificationIcon className="h-5 w-5 text-gray-400" />,
//                   false,
//                   undefined,
//                   undefined,
//                   tipoIdentificacion === 'extranjero' ? 20 : 12,
//                   tipoIdentificacion === 'extranjero' ? 6 : 9
//                 )}

//                 {/* Tipo de teléfono */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Teléfono</label>
//                   <select
//                     value={tipoTelefono}
//                     onChange={(e) => setTipoTelefono(e.target.value as any)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 sm:text-sm"
//                   >
//                     <option value="nacional">Nacional</option>
//                     <option value="extranjero">Extranjero</option>
//                   </select>
//                 </div>
//                 {/* Teléfono Extranjero */}
//                 {tipoTelefono === 'extranjero' ? (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Extranjero</label>
//                     <div className="flex gap-2 items-center">
//                       <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-l-md">+</span>
//                       <input
//                         type="text"
//                         name="telefonoPrefijo"
//                         value={formData.telefonoPrefijo}
//                         onChange={handleChange}
//                         className="w-20 px-3 py-2 border border-gray-300 rounded-md text-gray-900 sm:text-sm"
//                         maxLength={3}
//                         placeholder="Pref"
//                         required
//                       />
//                       <input
//                         type="tel"
//                         name="telefono"
//                         value={formData.telefono}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 sm:text-sm"
//                         maxLength={12}
//                         required
//                       />
//                     </div>
//                     {(fieldErrors.telefonoPrefijo || fieldErrors.telefono) && (
//                       <p className="mt-1 text-sm text-red-500">{fieldErrors.telefonoPrefijo || fieldErrors.telefono}</p>
//                     )}
//                   </div>
//                 ) : (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
//                     <div className="flex">
//                       <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-l-md">+506</span>
//                       <input
//                         type="tel"
//                         name="telefono"
//                         value={formData.telefono}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-r-md text-gray-900 sm:text-sm"
//                         maxLength={8}
//                         required
//                       />
//                     </div>
//                     {fieldErrors.telefono && (
//                       <p className="mt-1 text-sm text-red-500">{fieldErrors.telefono}</p>
//                     )}
//                   </div>
//                 )}


//                 {/* Passwords */}
//                 {renderInput('password', 'Contraseña', 'password', <LockClosedIcon className="h-5 w-5 text-gray-400" />, true, showPassword, setShowPassword)}
//                 {renderInput('confirmPassword', 'Confirmar Contraseña', 'password', <LockClosedIcon className="h-5 w-5 text-gray-400" />, true, showConfirmPassword, setShowConfirmPassword)}
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
//                 >
//                   Registrarse
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleBack}
//                   disabled={isSubmitting}
//                   className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 rounded-lg"
//                 >
//                   Volver
//                 </button>
//               </div>

//               <div className="text-center text-sm mt-4">
//                 <span className="text-gray-600">¿Ya tienes una cuenta?</span>{' '}
//                 <a href="/" className="text-blue-600 hover:text-blue-500 font-medium">Inicia sesión aquí</a>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// Formulario de registro ADMIN con estandarización del registro USER
import React, { useState } from 'react';
import {
  EnvelopeIcon,
  IdentificationIcon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiRoutes from '../../Components/ApiRoutes';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    cedula: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    telefono: '',
    telefonoPrefijo: '',
    password: '',
    confirmPassword: '',
    origin: 'user',
  });

  const [tipoIdentificacion, setTipoIdentificacion] = useState<'nacional' | 'residente' | 'extranjero'>('nacional');
  const [tipoTelefono, setTipoTelefono] = useState<'nacional' | 'extranjero'>('nacional');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateField = (name: string, value: string): string => {
    const onlyLetters = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
    const onlyLettersNoSpace = /^[A-Za-z]+$/;
    const onlyNumbers = /^[0-9]+$/;
    const phoneInternational = /^[1-9]{1}[0-9]{1,2}$/;
    const phoneNumber = /^[0-9]{7,12}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    switch (name) {
      case 'nombre':
        if (!onlyLetters.test(value)) return 'Solo letras y un espacio opcional';
        break;
      case 'apellido1':
      case 'apellido2':
        if (!onlyLettersNoSpace.test(value)) return 'Solo letras sin espacios';
        break;
      case 'cedula':
        if (tipoIdentificacion === 'nacional' && !/^\d{9}$/.test(value)) return 'Debe tener 9 dígitos';
        if (tipoIdentificacion === 'residente' && !/^\d{11,12}$/.test(value)) return 'Debe tener 11 o 12 dígitos';
        if (tipoIdentificacion === 'extranjero' && !/^[a-zA-Z0-9]{6,20}$/.test(value)) return 'Entre 6 y 20 caracteres alfanuméricos';
        break;
      case 'telefono':
        if (tipoTelefono === 'nacional') {
          if (!onlyNumbers.test(value) || value.length !== 8) return 'Debe tener exactamente 8 dígitos';
        } else {
          if (!phoneNumber.test(value)) return 'Entre 7 y 12 dígitos';
        }
        break;
      case 'telefonoPrefijo':
        if (tipoTelefono === 'extranjero' && !phoneInternational.test(value)) return 'Prefijo inválido (1-3 dígitos)';
        break;
      case 'email':
        if (!value.includes('@')) return 'Correo inválido';
        break;
      case 'password':
        if (!passwordRegex.test(value)) return 'Mínimo 8 caracteres, una letra y un número';
        break;
      case 'confirmPassword':
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        break;
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([k, v]) => {
      const err = validateField(k, v);
      if (err) newErrors[k] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      await MySwal.fire({ icon: 'error', title: 'Error', text: 'Revisa los campos marcados.', confirmButtonColor: '#ef4444' });
      setIsSubmitting(false);
      return;
    }

    const telefonoFinal = tipoTelefono === 'nacional' ? `+506-${formData.telefono}` : `+${formData.telefonoPrefijo}-${formData.telefono}`;
    let cedulaFinal = formData.cedula.trim();
    cedulaFinal = tipoIdentificacion === 'nacional' ? `CR-${cedulaFinal}` : tipoIdentificacion === 'residente' ? `RES-${cedulaFinal}` : `PAS-${cedulaFinal}`;

    const dataToSend = { ...formData, cedula: cedulaFinal, telefono: telefonoFinal };

    try {
      const res = await axios.post(`${ApiRoutes.usuarios}/register`, dataToSend);
      await MySwal.fire({ icon: 'success', title: '¡Registro exitoso!', text: res.data.message || 'Administrador creado correctamente.', confirmButtonColor: '#2563eb' });
      navigate('/');
    } catch (err: any) {
      await MySwal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'No se pudo registrar.', confirmButtonColor: '#ef4444' });
      setIsSubmitting(false);
    }
  };

  const renderInput = (name: string, label: string, type: string, icon: React.ReactNode, showToggle = false, toggle?: boolean, setToggle?: (val: boolean) => void, maxLength?: number) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
        <input
          id={name}
          name={name}
          type={showToggle && toggle ? 'text' : type}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          maxLength={maxLength}
          className={`appearance-none block w-full px-3 py-3 pl-10 border ${fieldErrors[name] ? 'border-red-500' : 'border-gray-300'} rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder={`Ingrese su ${label.toLowerCase()}`}
          required
        />
        {showToggle && toggle !== undefined && setToggle && (
          <button type="button" onClick={() => setToggle(!toggle)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {toggle ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
          </button>
        )}
      </div>
      {fieldErrors[name] && <p className="mt-1 text-sm text-red-500">{fieldErrors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="h-full w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Registro de Usuario
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid gap-6 md:grid-cols-2">
                {renderInput('nombre', 'Nombre', 'text', <UserIcon className="h-5 w-5 text-gray-400" />, false, undefined, undefined, 30)}
                {renderInput('apellido1', 'Primer apellido', 'text', <UserIcon className="h-5 w-5 text-gray-400" />, false, undefined, undefined, 30)}
                {renderInput('apellido2', 'Segundo apellido', 'text', <UserIcon className="h-5 w-5 text-gray-400" />, false, undefined, undefined, 30)}
                  
                                  {renderInput('email', 'Correo electrónico', 'email', <EnvelopeIcon className="h-5 w-5 text-gray-400" />, false)}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Identificación</label>
                  <select
                    value={tipoIdentificacion}
                    onChange={(e) => setTipoIdentificacion(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 sm:text-sm"
                  >
                    <option value="nacional">Cédula Nacional</option>
                    <option value="residente">DIMEX (Residente)</option>
                    <option value="extranjero">Pasaporte (Extranjero)</option>
                  </select>
                </div>

                {renderInput(
                  'cedula',
                  tipoIdentificacion === 'nacional'
                    ? 'Cédula Nacional'
                    : tipoIdentificacion === 'residente'
                      ? 'DIMEX'
                      : 'Pasaporte',
                  'text',
                  <IdentificationIcon className="h-5 w-5 text-gray-400" />,
                  false,
                  undefined,
                  undefined,
                  tipoIdentificacion === 'extranjero' ? 20 : 12
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Teléfono</label>
                  <select
                    value={tipoTelefono}
                    onChange={(e) => setTipoTelefono(e.target.value as 'nacional' | 'extranjero')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 sm:text-sm"
                  >
                    <option value="nacional">Nacional</option>
                    <option value="extranjero">Extranjero</option>
                  </select>
                </div>


                {tipoTelefono === 'extranjero' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Extranjero</label>
                    <div className="flex gap-2 items-center">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-l-md">+</span>
                      <input
                        type="text"
                        name="telefonoPrefijo"
                        value={formData.telefonoPrefijo}
                        onChange={handleChange}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md text-gray-900 sm:text-sm"
                        maxLength={3}
                        placeholder="Pref"
                        required
                      />
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 sm:text-sm"
                        maxLength={12}
                        required
                      />
                    </div>
                    {(fieldErrors.telefonoPrefijo || fieldErrors.telefono) && (
                      <p className="mt-1 text-sm text-red-500">{fieldErrors.telefonoPrefijo || fieldErrors.telefono}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm rounded-l-md">+506</span>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md text-gray-900 sm:text-sm"
                        maxLength={8}
                        required
                      />
                    </div>
                    {fieldErrors.telefono && (
                      <p className="mt-1 text-sm text-red-500">{fieldErrors.telefono}</p>
                    )}
                  </div>
                )}

                {renderInput('password', 'Contraseña', 'password', <LockClosedIcon className="h-5 w-5 text-gray-400" />, true, showPassword, setShowPassword)}
                {renderInput('confirmPassword', 'Confirmar Contraseña', 'password', <LockClosedIcon className="h-5 w-5 text-gray-400" />, true, showConfirmPassword, setShowConfirmPassword)}
              </div>

              <div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg">
                  Registrarse
                </button>
                <button type="button" onClick={() => navigate('/')} disabled={isSubmitting} className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 rounded-lg">
                  Volver
                </button>
              </div>

              <div className="text-center text-sm mt-4">
                <span className="text-gray-600">¿Ya tienes una cuenta?</span>{' '}
                <a href="/" className="text-blue-600 hover:text-blue-500 font-medium">Inicia sesión aquí</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
