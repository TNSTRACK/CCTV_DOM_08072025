// src/services/users.service.ts
// Servicio de lógica de negocio para usuarios

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Obtener usuarios que pueden ser recepcionistas
 * Retorna usuarios activos con roles OPERATOR o ADMINISTRATOR
 */
export const getUsersForReception = async () => {
  const users = await prisma.user.findMany({
    where: {
      active: true,
      role: {
        in: ['OPERATOR', 'ADMINISTRATOR'],
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
    orderBy: [
      { role: 'asc' }, // ADMINISTRATOR primero
      { firstName: 'asc' },
    ],
  });

  return users;
};