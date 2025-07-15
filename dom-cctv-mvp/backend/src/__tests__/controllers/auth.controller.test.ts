// src/__tests__/controllers/auth.controller.test.ts
// Tests para el controlador de autenticación - DOM CCTV MVP

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { login, register, getProfile, changePassword } from '../../controllers/auth.controller';
import { mockUser, mockRequest, mockResponse, mockNext } from '../setup';

// Mocks
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Controller', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext;
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debe autenticar usuario con credenciales válidas', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      req.validatedData = loginData;

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      mockJwt.sign = jest.fn().mockReturnValue('fake-jwt-token');

      // Ejecutar el middleware array
      const [validateMiddleware, loginController] = login;
      await loginController(req, res, next);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          role: true,
          active: true,
        },
      });

      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login exitoso',
        data: {
          token: 'fake-jwt-token',
          user: {
            id: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            role: mockUser.role,
          },
        },
      });
    });

    it('debe rechazar usuario inexistente', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      req.validatedData = loginData;

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      const [validateMiddleware, loginController] = login;

      await expect(loginController(req, res, next)).rejects.toThrow('Credenciales inválidas');
    });

    it('debe rechazar usuario inactivo', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      req.validatedData = loginData;

      const inactiveUser = { ...mockUser, active: false };
      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(inactiveUser);

      const [validateMiddleware, loginController] = login;

      await expect(loginController(req, res, next)).rejects.toThrow('Usuario inactivo');
    });

    it('debe rechazar contraseña incorrecta', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      req.validatedData = loginData;

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      mockBcrypt.compare = jest.fn().mockResolvedValue(false);

      const [validateMiddleware, loginController] = login;

      await expect(loginController(req, res, next)).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('register', () => {
    it('debe registrar nuevo usuario con datos válidos', async () => {
      const registerData = {
        email: 'newuser@example.com',
        password: 'Password123',
        firstName: 'New',
        lastName: 'User',
        role: 'OPERATOR' as const,
      };

      req.validatedData = registerData;
      req.user = { id: 'admin-id' };

      const newUser = {
        id: 'new-user-id',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        role: 'OPERATOR',
        active: true,
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);
      mockBcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
      mockPrisma.user.create = jest.fn().mockResolvedValue(newUser);

      const [validateMiddleware, registerController] = register;
      await registerController(req, res, next);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'newuser@example.com' },
      });

      expect(mockBcrypt.hash).toHaveBeenCalledWith('Password123', 10);

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'newuser@example.com',
          password: 'hashedpassword',
          firstName: 'New',
          lastName: 'User',
          role: 'OPERATOR',
          active: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          active: true,
          createdAt: true,
        },
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: { user: newUser },
      });
    });

    it('debe rechazar email ya registrado', async () => {
      const registerData = {
        email: 'existing@example.com',
        password: 'Password123',
        firstName: 'New',
        lastName: 'User',
        role: 'OPERATOR' as const,
      };

      req.validatedData = registerData;

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const [validateMiddleware, registerController] = register;

      await expect(registerController(req, res, next)).rejects.toThrow('El email ya está registrado');
    });
  });

  describe('getProfile', () => {
    it('debe obtener perfil del usuario autenticado', async () => {
      req.user = { id: 'test-user-id' };

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      await getProfile(req, res, next);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { user: mockUser },
      });
    });

    it('debe rechazar usuario no autenticado', async () => {
      req.user = null;

      await expect(getProfile(req, res, next)).rejects.toThrow('Usuario no autenticado');
    });

    it('debe rechazar usuario no encontrado', async () => {
      req.user = { id: 'test-user-id' };

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(getProfile(req, res, next)).rejects.toThrow('Usuario no encontrado');
    });
  });

  describe('changePassword', () => {
    it('debe cambiar contraseña con datos válidos', async () => {
      const passwordData = {
        currentPassword: 'oldpassword',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      };

      req.validatedData = passwordData;
      req.user = { id: 'test-user-id' };

      const userWithPassword = {
        id: 'test-user-id',
        password: 'hashedoldpassword',
      };

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(userWithPassword);
      mockBcrypt.compare = jest.fn().mockResolvedValue(true);
      mockBcrypt.hash = jest.fn().mockResolvedValue('hashednewpassword');
      mockPrisma.user.update = jest.fn().mockResolvedValue({ id: 'test-user-id' });

      const [validateMiddleware, changePasswordController] = changePassword;
      await changePasswordController(req, res, next);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        select: {
          id: true,
          password: true,
        },
      });

      expect(mockBcrypt.compare).toHaveBeenCalledWith('oldpassword', 'hashedoldpassword');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('NewPassword123', 10);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: { password: 'hashednewpassword' },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Contraseña actualizada exitosamente',
      });
    });

    it('debe rechazar contraseña actual incorrecta', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      };

      req.validatedData = passwordData;
      req.user = { id: 'test-user-id' };

      const userWithPassword = {
        id: 'test-user-id',
        password: 'hashedoldpassword',
      };

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(userWithPassword);
      mockBcrypt.compare = jest.fn().mockResolvedValue(false);

      const [validateMiddleware, changePasswordController] = changePassword;

      await expect(changePasswordController(req, res, next)).rejects.toThrow('Contraseña actual incorrecta');
    });

    it('debe rechazar usuario no autenticado', async () => {
      req.user = null;

      const [validateMiddleware, changePasswordController] = changePassword;

      await expect(changePasswordController(req, res, next)).rejects.toThrow('Usuario no autenticado');
    });

    it('debe rechazar usuario no encontrado', async () => {
      req.user = { id: 'test-user-id' };

      mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      const [validateMiddleware, changePasswordController] = changePassword;

      await expect(changePasswordController(req, res, next)).rejects.toThrow('Usuario no encontrado');
    });
  });
});

describe('Security Tests', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext;
    jest.clearAllMocks();
  });

  it('debe convertir email a minúsculas en login', async () => {
    const loginData = {
      email: 'TEST@EXAMPLE.COM',
      password: 'password123',
    };

    req.validatedData = loginData;

    mockPrisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
    mockBcrypt.compare = jest.fn().mockResolvedValue(true);
    mockJwt.sign = jest.fn().mockReturnValue('fake-jwt-token');

    const [validateMiddleware, loginController] = login;
    await loginController(req, res, next);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: expect.any(Object),
    });
  });

  it('debe convertir email a minúsculas en register', async () => {
    const registerData = {
      email: 'NEWUSER@EXAMPLE.COM',
      password: 'Password123',
      firstName: 'New',
      lastName: 'User',
      role: 'OPERATOR' as const,
    };

    req.validatedData = registerData;
    req.user = { id: 'admin-id' };

    const newUser = {
      id: 'new-user-id',
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
      role: 'OPERATOR',
      active: true,
      createdAt: new Date(),
    };

    mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);
    mockBcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
    mockPrisma.user.create = jest.fn().mockResolvedValue(newUser);

    const [validateMiddleware, registerController] = register;
    await registerController(req, res, next);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'newuser@example.com' },
    });

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'newuser@example.com',
      }),
      select: expect.any(Object),
    });
  });

  it('debe usar salt rounds correctos para bcrypt', async () => {
    const registerData = {
      email: 'newuser@example.com',
      password: 'Password123',
      firstName: 'New',
      lastName: 'User',
      role: 'OPERATOR' as const,
    };

    req.validatedData = registerData;
    req.user = { id: 'admin-id' };

    mockPrisma.user.findUnique = jest.fn().mockResolvedValue(null);
    mockBcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
    mockPrisma.user.create = jest.fn().mockResolvedValue({} as any);

    const [validateMiddleware, registerController] = register;
    await registerController(req, res, next);

    expect(mockBcrypt.hash).toHaveBeenCalledWith('Password123', 10);
  });

  it('debe generar token JWT con configuración correcta', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    req.validatedData = loginData;

    mockPrisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
    mockBcrypt.compare = jest.fn().mockResolvedValue(true);
    mockJwt.sign = jest.fn().mockReturnValue('fake-jwt-token');

    const [validateMiddleware, loginController] = login;
    await loginController(req, res, next);

    expect(mockJwt.sign).toHaveBeenCalledWith(
      { userId: mockUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  });
});