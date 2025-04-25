// // src/components/LugarDenunciaTable.tsx
// import React, { useState, useEffect } from 'react';
// import ApiRoutes from '../../Components/ApiRoutes';
// import Swal from 'sweetalert2';


// interface DenunciaData {
//   id: number;
//   descripcion: string;
// }

// const LugarDenunciaTable: React.FC = () => {
//   const [lugarDenuncias, setLugarDenuncias] = useState<DenunciaData[]>([]);
//   const [isAdding, setIsAdding] = useState<boolean>(false);
//   const [descripcion, setDescripcion] = useState<string>('');

//   useEffect(() => {
//     const cargarDatos = async () => {
//       try {
//         const lugares = await fetchDenunciaData('lugar-denuncia');
//         setLugarDenuncias(lugares);
//       } catch (error) {
//         console.error('Error al cargar datos:', error);
//       }
//     };
//     cargarDatos();
//   }, []);

//   const fetchDenunciaData = async (tipo: 'lugar-denuncia'): Promise<DenunciaData[]> => {
//     const urlBase = `${ApiRoutes.urlBase}/${tipo}`;
//     try {
//       const response = await fetch(urlBase, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
//       return await response.json();
//     } catch (error) {
//       console.error(`Error fetching ${tipo}:`, error);
//       throw error;
//     }
//   };

//   const abrirModalAgregar = () => {
//     setIsAdding(true);
//     setDescripcion('');
//   };

//   const cerrarModalAgregar = () => {
//     setIsAdding(false);
//   };

//   const manejarAgregar = async () => {
//     if (!descripcion.trim()) {
//       Swal.fire('Campo requerido', 'Por favor, ingresa una descripción.', 'info');
//       return;
//     }

//     try {
//       const response = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ descripcion }),
//       });

//       if (!response.ok) throw new Error(`Error al agregar lugar de denuncia.`);

//       const nuevaDenuncia = await response.json();
//       setLugarDenuncias([...lugarDenuncias, nuevaDenuncia]);
//       cerrarModalAgregar();
//       Swal.fire('¡Guardado!', 'Lugar de denuncia agregado correctamente.', 'success');
//     } catch (error) {
//       console.error(`Error agregando lugar de denuncia:`, error);
//       Swal.fire('Error', 'Ocurrió un error al agregar el lugar de denuncia.', 'error');
//     }
//   };

//   const manejarEliminar = async (id: number) => {
//     const confirmacion = await Swal.fire({
//       title: '¿Eliminar registro?',
//       text: 'Esta acción no se puede deshacer.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar',
//       confirmButtonColor: '#28a745',
//       cancelButtonColor: '#dc3545',
//     });

//     if (!confirmacion.isConfirmed) return;

//     try {
//       const response = await fetch(`${ApiRoutes.urlBase}/lugar-denuncia/${id}`, { method: 'DELETE' });

//       if (!response.ok) throw new Error(`Error al eliminar lugar de denuncia.`);

//       setLugarDenuncias(lugarDenuncias.filter((item) => item.id !== id));
//       Swal.fire('¡Eliminado!', 'El lugar de denuncia fue eliminado correctamente.', 'success');
//     } catch (error) {
//       console.error(`Error eliminando lugar de denuncia:`, error);
//       Swal.fire('Error', 'Ocurrió un error al eliminar el lugar de denuncia.', 'error');
//     }
//   };

//   return (
//     <div className="tabla-container">
//       <h2>Lugares de Denuncia</h2>

//       <button className="add-button" onClick={abrirModalAgregar}>
//         Agregar Nuevo Lugar de Denuncia
//       </button>

//       <table className="tabla-denuncias">
//         <thead>
//           <tr>
//             <th className="col-lugar">Lugar</th>
//             <th className="col-acciones">Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {lugarDenuncias.map((lugar) => (
//             <tr key={lugar.id}>
//               <td>{lugar.descripcion}</td>
//               <td>
//                 <button onClick={() => manejarEliminar(lugar.id)} className="button-delete">
//                   Eliminar
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {isAdding && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>Agregar Nuevo Lugar de Denuncia</h3>
//             <input
//               type="text"
//               className="descripcion-input"
//               placeholder="Descripción"
//               value={descripcion}
//               onChange={(e) => setDescripcion(e.target.value)}
//             />
//             <button onClick={manejarAgregar} className="guardar-button">Guardar</button>
//             <button onClick={cerrarModalAgregar} className="cancel-button">Cancelar</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LugarDenunciaTable;

// LugarDenunciaTable.tsx
import React from 'react';

const LugarDenunciaTable: React.FC = () => {
  return <div>Contenido de Lugar de Denuncia</div>;
};

export default LugarDenunciaTable;
