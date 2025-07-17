// src/hooks/useMetadata.ts
// Hook para gestionar metadatos de eventos

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/services/api';

export interface CreateMetadataData {
  eventId: string;
  companyId: string;
  guideNumber: string;
  guideDate: string; // ISO string
  cargoDescription: string;
  workOrder: string;
  receptionistId: string;
}

export interface MetadataResponse {
  id: string;
  eventId: string;
  companyId: string;
  guideNumber: string;
  guideDate: string;
  cargoDescription: string;
  workOrder: string;
  receptionistId: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    rut: string;
  };
  receptionist?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

/**
 * Hook para crear metadatos de un evento
 */
export const useCreateMetadata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMetadataData): Promise<MetadataResponse> => {
      const response = await apiRequest.post<{ data: MetadataResponse }>('/events/metadata', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.eventId] });
    },
  });
};

/**
 * Hook para obtener empresas disponibles
 */
export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      console.log('🔍 Fetching companies from API...');
      const response = await apiRequest.get<{ data: { companies: any[] } }>('/companies');
      console.log('📊 Companies API Response:', response.data);
      
      // El backend retorna { success: true, data: { companies: [...] } }
      const companies = response.data.data?.companies || response.data.data || [];
      console.log('📋 Processed companies:', companies);
      
      return companies;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener recepcionistas disponibles
 */
export const useReceptionists = () => {
  return useQuery({
    queryKey: ['receptionists'],
    queryFn: async () => {
      const response = await apiRequest.get<{ data: any[] }>('/users/receptionists');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};