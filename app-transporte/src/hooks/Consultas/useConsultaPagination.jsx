import { useState, useMemo } from 'react';

const useConsultaSolicitacaoPagination = (resultados, itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(resultados.length / itemsPerPage);

  const paginatedResultados = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return resultados.slice(startIndex, startIndex + itemsPerPage);
  }, [resultados, currentPage, itemsPerPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return {
    currentPage,
    totalPages,
    paginatedResultados,
    handlePageChange,
  };
};

export default useConsultaSolicitacaoPagination;
