import React, { useState } from 'react';
import {
  EnvelopeIcon,
  IdentificationIcon,
  UserIcon,
  PhoneIcon,
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
    password: '',
    confirmPassword: '',
    origin: 'user',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MySwal = withReactContent(Swal);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateField = (name: string, value: string): string => {
    const onlyLetters = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
    const onlyLettersNoSpace = /^[A-Za-z]+$/;
    const onlyNumbers = /^[0-9]+$/;
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
        if (!onlyNumbers.test(value) || value.length < 9 || value.length > 12)
          return 'Debe tener entre 9 y 12 dígitos numéricos';
        break;
      case 'telefono':
        if (!onlyNumbers.test(value) || value.length !== 8)
          return 'Debe tener exactamente 8 dígitos';
        break;
      case 'email':
        if (!value.includes('@')) return 'Correo inválido';
        break;
      case 'password':
        if (!passwordRegex.test(value))
          return 'Mínimo 8 caracteres, una letra y un número';
        break;
      case 'confirmPassword':
        if (!passwordRegex.test(value))
          return 'Mínimo 8 caracteres, una letra y un número';
        if (value !== formData.password)
          return 'Las contraseñas no coinciden';
        break;
      default:
        break;
    }

    return '';
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setErrorMessage('');
  //   setIsSubmitting(true); // Bloquea botones al enviar
  
  //   const newErrors: { [key: string]: string } = {};
  //   Object.entries(formData).forEach(([key, value]) => {
  //     const error = validateField(key, value);
  //     if (error) newErrors[key] = error;
  //   });
  
  //   if (Object.keys(newErrors).length > 0) {
  //     setFieldErrors(newErrors);
  //     setErrorMessage('Corrige los campos marcados.');
  //     setIsSubmitting(false); // Reactiva si hay errores
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${ApiRoutes.usuarios}/register`, formData);
    
  //     // 🎉 Alerta visual como en denuncias
  //     await MySwal.fire({
  //       icon: 'success',
  //       title: '¡Registro Exitoso!',
  //       text: response.data.message || 'Usuario registrado correctamente. Revisa tu correo electrónico.',
  //       confirmButtonText: 'Ir al inicio de sesión',
  //       confirmButtonColor: '#2563eb',
  //     });
    
  //     navigate('/');
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       setErrorMessage(error.response.data.message || 'Error en el registro');
  //     } else {
  //       setErrorMessage('Error de conexión con el servidor');
  //     }
  //     setIsSubmitting(false); // Reactiva si hay fallo
  //   }
  // };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrorMessage('');
  setIsSubmitting(true);

  const newErrors: { [key: string]: string } = {};
  Object.entries(formData).forEach(([key, value]) => {
    const error = validateField(key, value);
    if (error) newErrors[key] = error;
  });

  // ⚠️ Validación específica: contraseñas no coinciden
  if (formData.password !== formData.confirmPassword) {
    await MySwal.fire({
      icon: 'error',
      title: 'Contraseñas no coinciden',
      text: 'Asegúrate de que ambas contraseñas sean iguales.',
      confirmButtonColor: '#ef4444',
    });

    setFieldErrors(prev => ({
      ...prev,
      confirmPassword: 'Las contraseñas no coinciden',
    }));

    setIsSubmitting(false);
    return;
  }

  if (Object.keys(newErrors).length > 0) {
    setFieldErrors(newErrors);

    // 👉 Alertas específicas
    if (newErrors.email) {
      await MySwal.fire({
        icon: 'error',
        title: 'Correo Inválido',
        text: 'Por favor ingresa un correo electrónico válido.',
        confirmButtonColor: '#ef4444',
      });
    } else if (newErrors.confirmPassword) {
      await MySwal.fire({
        icon: 'error',
        title: 'Contraseña Inválida',
        text: 'La contraseña debe tener mínimo 8 caracteres, una letra y un número.',
        confirmButtonColor: '#ef4444',
      });
    } else {
      await MySwal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: 'Corrige los campos marcados antes de continuar.',
        confirmButtonColor: '#ef4444',
      });
    }

    setIsSubmitting(false);
    return;
  }

  try {
    const response = await axios.post(`${ApiRoutes.usuarios}/register`, formData);

    await MySwal.fire({
      icon: 'success',
      title: '¡Registro Exitoso!',
      text: response.data.message || 'Usuario registrado correctamente. Revisa tu correo electrónico.',
      confirmButtonText: 'Ir al inicio de sesión',
      confirmButtonColor: '#2563eb',
    });

    navigate('/');
  } catch (error) {
    let mensaje = 'Error de conexión con el servidor';
    if (axios.isAxiosError(error) && error.response) {
      mensaje = error.response.data.message || 'Error en el registro';
    }

    await MySwal.fire({
      icon: 'error',
      title: '¡Ups!',
      text: mensaje,
      confirmButtonColor: '#ef4444',
    });

    setIsSubmitting(false);
  }
};


  const handleBack = () => navigate('/');

  const renderInput = (
    name: string,
    label: string,
    type: string,
    icon: React.ReactNode,
    showPasswordToggle = false,
    passwordToggleValue?: boolean,
    setPasswordToggleValue?: (value: boolean) => void,
    maxLength?: number,
    minLength?: number
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type={showPasswordToggle && passwordToggleValue ? 'text' : type}
          required
          maxLength={maxLength}
          minLength={minLength}
          inputMode={type === 'tel' ? 'numeric' : undefined}
          className={`appearance-none block w-full px-3 py-3 pl-10 border ${
            fieldErrors[name] ? 'border-red-500' : 'border-gray-300'
          } rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder={`Ingrese su ${label.toLowerCase()}`}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
        />
        {showPasswordToggle && setPasswordToggleValue && (
          <button
            type="button"
            onClick={() => setPasswordToggleValue(!passwordToggleValue)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
          >
            {passwordToggleValue ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            )}
          </button>
        )}
      </div>
      {fieldErrors[name] && (
        <p className="mt-1 text-sm text-red-500">{fieldErrors[name]}</p>
      )}
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
{renderInput('cedula', 'Cédula', 'text', <IdentificationIcon className="h-5 w-5 text-gray-400" />, false, undefined, undefined, 12, 9)}
{renderInput('email', 'Correo electrónico', 'email', <EnvelopeIcon className="h-5 w-5 text-gray-400" />, false, undefined, undefined, 60)}
{renderInput('telefono', 'Teléfono', 'tel', <PhoneIcon className="h-5 w-5 text-gray-400" />, false, undefined, undefined, 8)}
{renderInput('password', 'Contraseña', 'password', <LockClosedIcon className="h-5 w-5 text-gray-400" />, true, showPassword, setShowPassword, 25)}
{renderInput('confirmPassword', 'Confirmar Contraseña', 'password', <LockClosedIcon className="h-5 w-5 text-gray-400" />, true, showConfirmPassword, setShowConfirmPassword, 25)}
              </div>

              {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Registrarse
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Volver
                </button>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-600">¿Ya tienes una cuenta?</span>{' '}
                <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
                  Inicia sesión aquí
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
