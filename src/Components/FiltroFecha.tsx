import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FiltroFechaProps {
  fechaFiltro: Date | null;
  onChangeFecha: (date: Date | null) => void;
}

const FiltroFecha: React.FC<FiltroFechaProps> = ({ fechaFiltro, onChangeFecha }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <label className="text-sm text-gray-700 whitespace-nowrap">Filtrar por fecha:</label>
      
      <DatePicker
        selected={fechaFiltro}
        onChange={onChangeFecha}
        dateFormat="yyyy-MM-dd"
        placeholderText="Selecciona una fecha"
        className="border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        popperPlacement="bottom-start"
        portalId="root-portal"
      />

      <button
        onClick={() => onChangeFecha(null)}
        className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Limpiar Fecha
      </button>
    </div>
  );
};

export default FiltroFecha;
