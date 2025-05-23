import { useMemo, useState } from 'react';

export const useMotoristasPagination = (filteredMotoristas, itemsPerPage = 10, initialSort = { field: 'nome', order: 'asc' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(initialSort);

  const sortedMotoristas = useMemo(() => {
    if (!filteredMotoristas) return [];
    return [...filteredMotoristas]
      .filter(motorista => motorista)
      .sort((a, b) => {
        const valueA = String(a?.[sortConfig.field] || '').toLowerCase();
        const valueB = String(b?.[sortConfig.field] || '').toLowerCase();
        return sortConfig.order === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
  }, [filteredMotoristas, sortConfig]);

  const totalPages = Math.ceil(sortedMotoristas.length / itemsPerPage);

  const paginatedMotoristas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedMotoristas.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedMotoristas, currentPage, itemsPerPage]);

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
    sortedMotoristas,
    paginatedMotoristas,
    sortConfig,
    handlePageChange,
    handleSortChange,
  };
};
