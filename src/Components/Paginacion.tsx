import React from 'react';

interface PaginacionProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Paginacion: React.FC<PaginacionProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
      {/* Controles de página */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md border ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
        >
          Siguiente
        </button>
      </div>

      {/* Selector de ítems por página */}
      <div className="flex items-center gap-2 text-sm mt-3">

  <select
    id="itemsPerPageSelect"
    value={itemsPerPage}
    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
    className="h-8 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
  >
    <option value={5}>5</option>
    <option value={10}>10</option>
    <option value={15}>15</option>
    <option value={20}>20</option>
  </select>
  <span className="text-gray-700 font-medium">items por página</span>
</div>


    </div>
  );
};

export default Paginacion;
