// src/stores/uiStore.ts
// Store Zustand para manejo del estado de la UI

import { create } from 'zustand';
import { UiStore, Notification } from '@/types';

// PATRÓN: Store de UI para estado global de la interfaz
export const useUiStore = create<UiStore>((set, get) => ({
  sidebarOpen: true,
  theme: 'light',
  notifications: [],

  setSidebarOpen: (open: boolean) => {
    set({ sidebarOpen: open });
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    // Guardar preferencia en localStorage
    localStorage.setItem('theme', theme);
  },

  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 4000,
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remover notificación después del tiempo especificado
    if (newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));