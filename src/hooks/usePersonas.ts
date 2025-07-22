import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personaApi } from '../services/api';
import { Persona } from '../App';

export const usePersonas = () => {
  const queryClient = useQueryClient();

  const {
    data: personas = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['personas'],
    queryFn: personaApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createPersonaMutation = useMutation({
    mutationFn: personaApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    },
  });

  const updatePersonaMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Persona> }) =>
      personaApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    },
  });

  const deletePersonaMutation = useMutation({
    mutationFn: personaApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    },
  });

  return {
    personas,
    isLoading,
    error,
    refetch,
    createPersona: createPersonaMutation.mutateAsync,
    updatePersona: updatePersonaMutation.mutateAsync,
    deletePersona: deletePersonaMutation.mutateAsync,
    isCreating: createPersonaMutation.isPending,
    isUpdating: updatePersonaMutation.isPending,
    isDeleting: deletePersonaMutation.isPending,
  };
};