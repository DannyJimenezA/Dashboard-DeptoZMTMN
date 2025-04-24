import { useEffect, useState } from 'react';
import axios from 'axios';
import ApiRoutes from '../../Components/ApiRoutes';
import { User } from '../Types';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const MiPerfil = () => {
  const [perfil, setPerfil] = useState<User | null>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get(ApiRoutes.miPerfil, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPerfil(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    if (token) {
      fetchPerfil();
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validarContrasenaFuerte = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async () => {
    try {
      if (showPasswordFields) {
        if (newPassword !== confirmPassword) {
          await MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden',
          });
          return;
        }
      
        if (!validarContrasenaFuerte(newPassword)) {
          await MySwal.fire({
            icon: 'warning',
            title: 'Contraseña inválida',
            text: 'Debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un número.',
          });
          return;
        }
      }
  
      // ✅ Mostrar confirmación antes de guardar
      const result = await MySwal.fire({
        title: '¿Guardar cambios?',
        text: 'Esta acción actualizará tu perfil.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
      });
      
  
      if (!result.isConfirmed) return;
  
      const dataToSend = {
        ...formData,
        newPassword: newPassword || undefined,
        currentPassword: showPasswordFields ? currentPassword : undefined,
      };
  
      // Opcional: mostrar loading
      MySwal.fire({
        title: 'Guardando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
      await axios.patch(ApiRoutes.miPerfil, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      Swal.close(); // cerrar el loading
  
      await MySwal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: showPasswordFields
          ? 'Tu perfil y contraseña se han actualizado correctamente.'
          : 'Tu perfil ha sido actualizado.',
      });
  
      setEditando(false);
      setShowPasswordFields(false);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
    } catch (error: any) {
      Swal.close(); // cerrar loading si hay error
  
      console.error('Error al guardar cambios:', error);
      await MySwal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error?.response?.data?.message || 'Ocurrió un error inesperado.',
      });
    }
  };

  if (!perfil) return <div className="text-center mt-10">Cargando perfil...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Mi Información</h2>

      <div className="space-y-4">
        {/* Campos de información */}
        <label className="block">
          <span className="text-gray-700">Nombre:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="text"
            name="nombre"
            value={formData.nombre || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Apellido 1:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="text"
            name="apellido1"
            value={formData.apellido1 || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Apellido 2:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="text"
            name="apellido2"
            value={formData.apellido2 || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Teléfono:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="text"
            name="telefono"
            value={formData.telefono?.toString() || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Correo electrónico:</span>
          <input
            className="border px-2 py-1 w-full rounded"
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        {/* Cambiar contraseña */}
        {editando && (
          <>
            <button
              className="text-sm text-blue-600 underline"
              type="button"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              {showPasswordFields ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
            </button>

            {showPasswordFields && (
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="text-gray-700">Contraseña actual:</span>
                  <input
                    className="border px-2 py-1 w-full rounded"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">Nueva contraseña:</span>
                  <input
                    className="border px-2 py-1 w-full rounded"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700">Confirmar contraseña:</span>
                  <input
                    className="border px-2 py-1 w-full rounded"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              </div>
            )}
          </>
        )}
      </div>

      {/* Botones */}
      <div className="mt-6 flex justify-between">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>

        {!editando ? (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setEditando(true)}
          >
            Editar
          </button>
        ) : (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            onClick={handleSubmit}
          >
            Guardar cambios
          </button>
        )}
      </div>
    </div>
  );
};

export default MiPerfil;
