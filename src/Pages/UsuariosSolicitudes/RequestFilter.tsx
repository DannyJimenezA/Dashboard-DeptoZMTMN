interface RequestFilterProps {
    filter: 'Todas' | 'Plano' | 'Prórroga' | 'Precario' | 'Concesión' | 'CopiaExpediente'; // Filtro actual
    onFilterChange: (filter: 'Todas' | 'Plano' | 'Prórroga' | 'Precario' | 'Concesión' | 'CopiaExpediente') => void; // Función para cambiar el filtro
  }
  
  export const RequestFilter: React.FC<RequestFilterProps> = ({ filter, onFilterChange }) => {
    return (
      <div className="mb-6">
        <label htmlFor="filter" className="block text-gray-700 font-medium mb-2">
          Filtrar por tipo:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as 'Todas' | 'Plano' | 'Prórroga' | 'Precario' | 'Concesión' | 'CopiaExpediente')}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="Todas">Todas</option>
          <option value="Plano">Planos</option>
          <option value="Prórroga">Prórrogas</option>
          <option value="Precario">Precarios</option>
          <option value="Concesión">Concesiones</option>
          <option value="CopiaExpediente">Concesiones</option>
        </select>
      </div>
    );
  };
  