import { useEffect, useState } from 'react';
import { getMotoristas } from '../../services/MotoristaService';
import { getCarros } from '../../services/CarroService';
import { getDestinos } from '../../services/DestinoService';
import { getSetores } from '../../services/SetorService';
import { consultarSolicitacoes } from '../../services/SolicitacaoService';
import { format } from 'date-fns';

const useConsultaSolicitacaoLogic = () => {
  const [filters, setFilters] = useState({
    motoristaId: '',
    carroId: '',
    destinoId: '',
    setorId: '',
    dataInicio: null,
    dataFim: null,
  });

  const [filteredSolicitacoes, setFilteredSolicitacoes] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [motoristas, setMotoristas] = useState([]);
  const [carros, setCarros] = useState([]);
  const [setores, setSetores] = useState([]);
  const [destinos, setDestinos] = useState([]);

  const handleConsultar = async () => {
    setLoading(true);
    try {
      const formattedFilters = {
        ...filters,
        motoristaId: filters.motoristaId || null,
        carroId: filters.carroId || null,
        destinoId: filters.destinoId || null,
        setorId: filters.setorId || null,
        dataInicio: filters.dataInicio ? format(filters.dataInicio, 'yyyy-MM-dd') : null,
        dataFim: filters.dataFim ? format(filters.dataFim, 'yyyy-MM-dd') : null,
      };

      const response = await consultarSolicitacoes(formattedFilters);
      setSolicitacoes(response?.content || []);
    } catch (error) {
      console.error('Erro na consulta:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados auxiliares ao montar
  useEffect(() => {
    const carregarDadosAuxiliares = async () => {
      try {
        const [motoristasRes, carrosRes, setoresRes, destinosRes] = await Promise.all([
          getMotoristas(),
          getCarros(),
          getSetores(),
          getDestinos(),
        ]);

        setMotoristas(motoristasRes);
        setCarros(carrosRes);
        setSetores(setoresRes);
        setDestinos(destinosRes);
      } catch (error) {
        console.error('Erro ao carregar dados auxiliares:', error);
      }
    };

    carregarDadosAuxiliares();
  }, []); // Executa só uma vez ao montar

  useEffect(() => {
    if (solicitacoes.length) {
      const resultadoFiltrado = solicitacoes.filter((s) => {
        return (
          (!filters.motoristaId || s.idMotorista === Number(filters.motoristaId)) &&
          (!filters.carroId || s.idCarro === Number(filters.carroId)) &&
          (!filters.destinoId || s.idDestino === Number(filters.destinoId)) &&
          (!filters.setorId || s.idSetor === Number(filters.setorId)) &&
          (!filters.dataInicio || new Date(s.dataSolicitacao) >= new Date(filters.dataInicio)) &&
          (!filters.dataFim || new Date(s.dataSolicitacao) <= new Date(filters.dataFim))
        );
      });

      setFilteredSolicitacoes(resultadoFiltrado);
    } else {
      setFilteredSolicitacoes([]);
    }
  }, [solicitacoes, filters]);

  return {
    filters,
    setFilters,
    filteredSolicitacoes,
    motoristas,
    carros,
    setores,
    destinos,
    solicitacoes,
    loading,
    handleConsultar,
  };
};

export default useConsultaSolicitacaoLogic;
