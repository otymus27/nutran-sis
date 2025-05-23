import { useMemo, useState } from 'react';

export const useSetorPagination = (filteredSetores, itemsPerPage = 10, initialSort = { field: 'nome', order: 'asc' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(initialSort);

  const sortedSetores = useMemo(() => {
    if (!filteredSetores) return [];
    return [...filteredSetores]
      .filter(setor => setor)
      .sort((a, b) => {
        const valueA = String(a?.[sortConfig.field] || '').toLowerCase();
        const valueB = String(b?.[sortConfig.field] || '').toLowerCase();
        return sortConfig.order === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
  }, [filteredSetores, sortConfig]);

  const totalPages = Math.ceil(sortedSetores.length / itemsPerPage);

  const paginatedSetores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedSetores.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedSetores, currentPage, itemsPerPage]);

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
    sortedSetores,
    paginatedSetores,
    sortConfig,
    handlePageChange,
    handleSortChange,
  };
};
