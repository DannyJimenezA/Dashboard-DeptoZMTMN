import React, { useState, useEffect } from 'react';
import ApiRoutes from '../../Components/ApiRoutes';
import Swal from 'sweetalert2';

interface DenunciaData {
  id: number;
  descripcion: string;
}

const TipoDenunciaTable: React.FC = () => {
  const [tipoDenuncias, setTipoDenuncias] = useState<DenunciaData[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [descripcion, setDescripcion] = useState<string>('');

  useEffect(() => {
    const fetchTipoDenuncias = async () => {
      try {
        const response = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        setTipoDenuncias(data);
      } catch (error) {
        console.error('Error fetching tipo-denuncia:', error);
      }
    };

    fetchTipoDenuncias();
  }, []);

  const abrirModalAgregar = () => {
    setIsAdding(true);
    setDescripcion('');
  };

  const cerrarModalAgregar = () => {
    setIsAdding(false);
  };

  const manejarAgregar = async () => {
    if (!descripcion.trim()) {
      Swal.fire('Campo requerido', 'Por favor, ingresa una descripción.', 'info');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion }),
      });

      if (!response.ok) throw new Error(`Error al agregar tipo-denuncia.`);

      const nuevaDenuncia = await response.json();
      setTipoDenuncias([...tipoDenuncias, nuevaDenuncia]);
      cerrarModalAgregar();
      Swal.fire('¡Guardado!', 'Tipo de denuncia agregado correctamente.', 'success');
    } catch (error) {
      console.error('Error agregando tipo-denuncia:', error);
      Swal.fire('Error', 'Ocurrió un error al agregar el tipo de denuncia.', 'error');
    }
  };

  const manejarEliminar = async (id: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar tipo de denuncia?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const response = await fetch(`${ApiRoutes.urlBase}/tipo-denuncia/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error(`Error al eliminar tipo-denuncia.`);

      setTipoDenuncias(tipoDenuncias.filter((item) => item.id !== id));
      Swal.fire('¡Eliminado!', 'El tipo de denuncia fue eliminado correctamente.', 'success');
    } catch (error) {
      console.error('Error eliminando tipo-denuncia:', error);
      Swal.fire('Error', 'Ocurrió un error al eliminar el tipo de denuncia.', 'error');
    }
  };

  return (
    <div className="tabla-container">
      <h2>Gestión de Tipos de Denuncia</h2>

      <button className="add-button" onClick={abrirModalAgregar}>
        Agregar Nuevo Tipo de Denuncia
      </button>

      <table className="tabla-denuncias">
        <thead>
          <tr>
            <th className="col-tipo">Tipo</th>
            <th className="col-acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipoDenuncias.map((tipo) => (
            <tr key={tipo.id}>
              <td>{tipo.descripcion}</td>
              <td>
                <button onClick={() => manejarEliminar(tipo.id)} className="button-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Nuevo Tipo de Denuncia</h3>
            <input
              type="text"
              className="descripcion-input"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <button onClick={manejarAgregar} className="guardar-button">Guardar</button>
            <button onClick={cerrarModalAgregar} className="cancel-button">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipoDenunciaTable;
