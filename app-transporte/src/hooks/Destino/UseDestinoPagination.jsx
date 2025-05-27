import { useMemo, useState } from 'react';

export const useDestinoPagination = (
  filteredDestinos,
  itemsPerPage = 10,
  initialSort = { field: 'nome', order: 'asc' },
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(initialSort);

  const sortedDestinos = useMemo(() => {
    if (!filteredDestinos) return [];
    return [...filteredDestinos]
      .filter((destino) => destino)
      .sort((a, b) => {
        const valueA = String(a?.[sortConfig.field] || '').toLowerCase();
        const valueB = String(b?.[sortConfig.field] || '').toLowerCase();
        return sortConfig.order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
  }, [filteredDestinos, sortConfig]);

  const totalPages = Math.ceil(sortedDestinos.length / itemsPerPage);

  const paginatedDestinos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedDestinos.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedDestinos, currentPage, itemsPerPage]);

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
    sortedDestinos,
    paginatedDestinos,
    sortConfig,
    handlePageChange,
    handleSortChange,
  };
};
