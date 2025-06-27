import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserService } from '../auth-user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserRegisterAuthDto } from '../dto/UserRegisterAuth.dto';
import { UserLoginAuthDto } from '../dto/UserLoginAuth.dto';
import { ModeratorRegisterAuthDto } from '../dto/ModeratorRegisterAuthDto';
import { ModeratorLoginAuthDto } from '../dto/ModeratorLoginAuthDto';

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('AuthUserService', () => {
  let service: AuthUserService;
  let prisma: PrismaService;

  // Mock de PrismaService
  const mockPrisma = {
    usuario: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    moderador: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  // Configuración inicial antes de cada prueba
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthUserService>(AuthUserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // Limpieza de mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Pruebas para registerUser
  describe('registerUser', () => {
    it('debería registrar un nuevo usuario correctamente', async () => {
      const userDto: UserRegisterAuthDto = {
        nombre: 'Juan',
        apellidos: 'Pérez',
        correo: 'juan@example.com',
        dni: 12345678,
        password: 'contraseña123',
        estado: 'active',
        insignias: '1',
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = { id: 1, ...userDto, password: hashedPassword };

      (hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.usuario.create.mockResolvedValue(createdUser);

      const result = await service.registerUser(userDto);

      expect(hash).toHaveBeenCalledWith('contraseña123', 10);
      expect(mockPrisma.usuario.create).toHaveBeenCalledWith({
        data: {
          nombre: 'Juan',
          apellidos: 'Pérez',
          correo: 'juan@example.com',
          dni: 12345678,
          password: hashedPassword,
          estado: 'active',
          insignia: '1',
        },
      });
      expect(result).toEqual(createdUser);
    });

    it('debería lanzar BadRequestException si falla el registro', async () => {
      const userDto: UserRegisterAuthDto = {
        nombre: 'Juan',
        apellidos: 'Pérez',
        correo: 'juan@example.com',
        dni: 12345678,
        password: 'contraseña123',
        estado: 'active',
        insignias: '1',
      };

      (hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrisma.$transaction.mockImplementation(async (fn) => fn(mockPrisma));
      mockPrisma.usuario.create.mockRejectedValue(new Error('Error en la base de datos'));

      await expect(service.registerUser(userDto)).rejects.toThrow(BadRequestException);
    });
  });

  // Pruebas para registerModerator
  describe('registerModerator', () => {
    it('debería registrar un moderador con contraseña hasheada', async () => {
      const moderatorDto: ModeratorRegisterAuthDto = {
        nombre: 'Ana',
        apellidos: 'Gómez',
        correo: 'ana@example.com',
        password: 'contraseña123',
      };
      const hashedPassword = 'hashedPassword';
      const createdModerator = { id: 1, ...moderatorDto, password: hashedPassword };

      (hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrisma.moderador.create.mockResolvedValue(createdModerator);

      const result = await service.registerModerator(moderatorDto);

      expect(hash).toHaveBeenCalledWith('contraseña123', 10);
      expect(mockPrisma.moderador.create).toHaveBeenCalledWith({
        data: {
          nombre: 'Ana',
          apellidos: 'Gómez',
          correo: 'ana@example.com',
          password: hashedPassword,
        },
      });
      expect(result).toEqual(createdModerator);
    });

    it('debería registrar un moderador sin volver a hashear si la contraseña ya está hasheada', async () => {
      const moderatorDto: ModeratorRegisterAuthDto = {
        nombre: 'Ana',
        apellidos: 'Gómez',
        correo: 'ana@example.com',
        password: '$2b$10$hashed',
      };
      const createdModerator = { id: 1, ...moderatorDto };

      mockPrisma.moderador.create.mockResolvedValue(createdModerator);

      const result = await service.registerModerator(moderatorDto);

      expect(hash).not.toHaveBeenCalled();
      expect(mockPrisma.moderador.create).toHaveBeenCalledWith({
        data: {
          nombre: 'Ana',
          apellidos: 'Gómez',
          correo: 'ana@example.com',
          password: '$2b$10$hashed',
        },
      });
      expect(result).toEqual(createdModerator);
    });

    it('debería lanzar BadRequestException si falla el registro', async () => {
      const moderatorDto: ModeratorRegisterAuthDto = {
        nombre: 'Ana',
        apellidos: 'Gómez',
        correo: 'ana@example.com',
        password: 'contraseña123',
      };

      (hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrisma.moderador.create.mockRejectedValue(new Error('Error en la base de datos'));

      await expect(service.registerModerator(moderatorDto)).rejects.toThrow(BadRequestException);
    });
  });

  // Pruebas para getUser
  describe('getUser', () => {
    it('debería devolver un usuario por correo electrónico', async () => {
      const userDto: UserLoginAuthDto = { email: 'juan@example.com', password: 'juanpablo_14123' };
      const user = { id: 1, correo: 'juan@example.com' };

      mockPrisma.usuario.findUnique.mockResolvedValue(user);

      const result = await service.getUser(userDto);

      expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { correo: 'juan@example.com' },
      });
      expect(result).toEqual(user);
    });

    it('debería devolver null si no se encuentra el usuario', async () => {
      const userDto: UserLoginAuthDto = { email: 'noexiste@example.com', password: 'blocked_1352'};

      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      const result = await service.getUser(userDto);

      expect(result).toBeNull();
    });
  });

  // Pruebas para getModerator
  describe('getModerator', () => {
    it('debería devolver un moderador por correo electrónico', async () => {
      const moderatorDto: ModeratorLoginAuthDto = { email: 'ana@example.com', password: 'ana_paula_2345' };
      const moderator = { id: 1, correo: 'ana@example.com' };

      mockPrisma.moderador.findUnique.mockResolvedValue(moderator);

      const result = await service.getModerator(moderatorDto);

      expect(mockPrisma.moderador.findUnique).toHaveBeenCalledWith({
        where: { correo: 'ana@example.com' },
      });
      expect(result).toEqual(moderator);
    });

    it('debería devolver null si no se encuentra el moderador', async () => {
      const moderatorDto: ModeratorLoginAuthDto = { email: 'noexiste@example.com', password: 'contraseniaerronea' };
      mockPrisma.moderador.findUnique.mockResolvedValue(null);

      const result = await service.getModerator(moderatorDto);

      expect(result).toBeNull();
    });
  });

  // Pruebas para upgradeUserToModerator
  describe('upgradeUserToModerator', () => {
    it('debería promover un usuario a moderador correctamente', async () => {
      const userId = 1;
      const user = {
        id: userId,
        nombre: 'Juan',
        apellidos: 'Pérez',
        correo: 'juan@example.com',
        password: 'hashedPassword',
      };

      mockPrisma.usuario.findUnique.mockResolvedValue(user);

      const result = await service.upgradeUserToModerator(userId);

      expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual({
        nombre: 'Juan',
        apellidos: 'Pérez',
        correo: 'juan@example.com',
        password: 'hashedPassword',
      });
    });

    it('debería lanzar BadRequestException si no se encuentra el usuario', async () => {
      const userId = 999;

      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.upgradeUserToModerator(userId)).rejects.toThrow(BadRequestException);
    });
  });

  // Pruebas para upgradeUser
  describe('upgradeUser', () => {
    it('debería incrementar la insignia del usuario correctamente', async () => {
      const userId = 1;
      const user = { id: userId, insignia: '1' };
      const updatedUser = { ...user, insignia: '2' };

      mockPrisma.usuario.findUnique.mockResolvedValue(user);
      mockPrisma.usuario.update.mockResolvedValue(updatedUser);

      const result = await service.upgradeUser(userId);

      expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrisma.usuario.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { insignia: '2' },
      });
      expect(result).toEqual(updatedUser);
    });

    it('debería lanzar BadRequestException si no se encuentra el usuario', async () => {
      const userId = 999;

      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.upgradeUser(userId)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar BadRequestException si la insignia no es un número', async () => {
      const userId = 1;
      const user = { id: userId, insignia: 'no-es-un-numero' };

      mockPrisma.usuario.findUnique.mockResolvedValue(user);

      await expect(service.upgradeUser(userId)).rejects.toThrow(BadRequestException);
    });
  });

  // Pruebas para getAllUsers
  describe('getAllUsers', () => {
    it('debería devolver todos los usuarios', async () => {
      const users = [{ id: 1 }, { id: 2 }];

      mockPrisma.usuario.findMany.mockResolvedValue(users);

      const result = await service.getAllUsers();

      expect(mockPrisma.usuario.findMany).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
});