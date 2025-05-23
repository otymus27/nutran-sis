import { useMemo, useState } from 'react';

export const useCarroPagination = (
  filteredCarros,
  itemsPerPage = 10,
  initialSort = { field: 'placa', order: 'asc' }
) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(initialSort);

  const sortedCarros = useMemo(() => {
    if (!filteredCarros) return [];
    return [...filteredCarros]
      .filter(carro => carro)
      .sort((a, b) => {
        const valueA = String(a?.[sortConfig.field] || '').toLowerCase();
        const valueB = String(b?.[sortConfig.field] || '').toLowerCase();
        return sortConfig.order === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
  }, [filteredCarros, sortConfig]);

  const totalPages = Math.ceil(sortedCarros.length / itemsPerPage);

  const paginatedCarros = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedCarros.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCarros, currentPage, itemsPerPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSortChange = (field) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.field === field) {
        return { field, order: prevConfig.order === 'asc' ? 'desc' : 'asc' };
      }
      return { field, order: 'asc' };
    });
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    sortedCarros,
    paginatedCarros,
    sortConfig,
    handlePageChange,
    handleSortChange,
  };
};
