import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  searchPlaceholder?: string;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchByOptions: Option[];
  selectedSearchBy: string;
  onSearchByChange: (value: string) => void;
  extraFilters?: React.ReactNode;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchPlaceholder = 'Buscar...',
  searchText,
  onSearchTextChange,
  searchByOptions,
  selectedSearchBy,
  onSearchByChange,
  extraFilters,
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-end mb-4 w-full">
      
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        className="flex-grow py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
      />

      {/* Selector de campo por el cual buscar */}
      <select
        value={selectedSearchBy}
        onChange={(e) => onSearchByChange(e.target.value)}
        className="w-40 py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {searchByOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Filtros extra (estado, fecha, limpiar) */}
      {extraFilters && (
        <div className="flex flex-wrap gap-2 items-end">
          {extraFilters}
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
