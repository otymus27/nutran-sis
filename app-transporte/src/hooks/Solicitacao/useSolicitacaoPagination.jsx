import { useMemo, useState } from 'react';

export const useSolicitacaoPagination = (
  filteredSolicitacoes,
  itemsPerPage = 10,
  initialSort = { field: 'data', order: 'desc' },
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(initialSort);

  const sortedSolicitacoes = useMemo(() => {
    if (!filteredSolicitacoes) return [];
    return [...filteredSolicitacoes]
      .filter((solicitacao) => solicitacao)
      .sort((a, b) => {
        const valueA = (a?.[sortConfig.field] ?? '').toString().toLowerCase();
        const valueB = (b?.[sortConfig.field] ?? '').toString().toLowerCase();

        if (sortConfig.field === 'data') {
          // For dates, compare as Date objects
          const dateA = new Date(a.data);
          const dateB = new Date(b.data);
          return sortConfig.order === 'asc' ? dateA - dateB : dateB - dateA;
        }

        return sortConfig.order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
  }, [filteredSolicitacoes, sortConfig]);

  const totalPages = Math.ceil(sortedSolicitacoes.length / itemsPerPage);

  const paginatedSolicitacoes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedSolicitacoes.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedSolicitacoes, currentPage, itemsPerPage]);

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
    sortedSolicitacoes,
    paginatedSolicitacoes,
    sortConfig,
    handlePageChange,
    handleSortChange,
  };
};
