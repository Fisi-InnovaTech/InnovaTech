import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserController } from '../auth-user.controller';
import { AuthUserService } from '../auth-user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { UserLoginAuthDto } from '../dto/UserLoginAuth.dto';
import { UserRegisterAuthDto } from '../dto/UserRegisterAuth.dto';
import { ModeratorLoginAuthDto } from '../dto/ModeratorLoginAuthDto';
import { ModeratorRegisterAuthDto } from '../dto/ModeratorRegisterAuthDto';
import * as bcrypt from 'bcrypt';

// Mock de bcrypt.compare
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthUserController', () => {
  let controller: AuthUserController;
  let authUserService: AuthUserService;
  let jwtService: JwtService;

  // Mock de AuthUserService
  const mockAuthUserService = {
    getUser: jest.fn(),
    registerUser: jest.fn(),
    getModerator: jest.fn(),
    registerModerator: jest.fn(),
    upgradeUserToModerator: jest.fn(),
    upgradeUser: jest.fn(),
    getAllUsers: jest.fn(),
  };

  // Mock de JwtService
  const mockJwtService = {
    sign: jest.fn(),
  };

  // Configuración inicial antes de cada prueba
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthUserController],
      providers: [
        { provide: AuthUserService, useValue: mockAuthUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthUserController>(AuthUserController);
    authUserService = module.get<AuthUserService>(AuthUserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // Limpieza de mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Pruebas para login
  describe('login', () => {
    it('debería devolver un token y el usuario si las credenciales son correctas', async () => {
      const userDto: UserLoginAuthDto = { email: 'juan@example.com', password: 'contraseña123' };
      const user = { id: 1, correo: 'juan@example.com', password: 'hashedPassword' };
      const token = 'jwt_token';

      mockAuthUserService.getUser.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await controller.login(userDto);

      expect(mockAuthUserService.getUser).toHaveBeenCalledWith(userDto);
      expect(bcrypt.compare).toHaveBeenCalledWith('contraseña123', 'hashedPassword');
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: 1, name: 'juan@example.com' });
      expect(result).toEqual({ token, user, status: 200 });
    });

    it('debería lanzar BadRequestException si el usuario no existe', async () => {
      const userDto: UserLoginAuthDto = { email: 'noexiste@example.com', password: 'contraseña123' };

      mockAuthUserService.getUser.mockResolvedValue(null);

      await expect(controller.login(userDto)).rejects.toThrow(BadRequestException);
      expect(mockAuthUserService.getUser).toHaveBeenCalledWith(userDto);
    });

    it('debería lanzar BadRequestException si la contraseña es incorrecta', async () => {
      const userDto: UserLoginAuthDto = { email: 'juan@example.com', password: 'contraseñaIncorrecta' };
      const user = { id: 1, correo: 'juan@example.com', password: 'hashedPassword' };

      mockAuthUserService.getUser.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(controller.login(userDto)).rejects.toThrow(BadRequestException);
      expect(mockAuthUserService.getUser).toHaveBeenCalledWith(userDto);
      expect(bcrypt.compare).toHaveBeenCalledWith('contraseñaIncorrecta', 'hashedPassword');
    });
  });

  // Pruebas para register
  describe('register', () => {
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
      const createdUser = { id: 1, ...userDto };

      mockAuthUserService.registerUser.mockResolvedValue(createdUser);

      const result = await controller.register(userDto);

      expect(mockAuthUserService.registerUser).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(createdUser);
    });
  });

  // Pruebas para loginModerator
  describe('loginModerator', () => {
    it('debería devolver un token y el moderador si las credenciales son correctas', async () => {
      const moderatorDto: ModeratorLoginAuthDto = { email: 'ana@example.com', password: 'contraseña123' };
      const moderator = { id: 1, correo: 'ana@example.com', password: 'hashedPassword' };
      const token = 'jwt_token';

      mockAuthUserService.getModerator.mockResolvedValue(moderator);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await controller.loginModerator(moderatorDto);

      expect(mockAuthUserService.getModerator).toHaveBeenCalledWith(moderatorDto);
      expect(bcrypt.compare).toHaveBeenCalledWith('contraseña123', 'hashedPassword');
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: 1, name: 'ana@example.com' });
      expect(result).toEqual({ token, user: moderator, status: 200 });
    });

    it('debería lanzar BadRequestException si el moderador no existe', async () => {
      const moderatorDto: ModeratorLoginAuthDto = { email: 'noexiste@example.com', password: 'contraseña123' };

      mockAuthUserService.getModerator.mockResolvedValue(null);

      await expect(controller.loginModerator(moderatorDto)).rejects.toThrow(BadRequestException);
      expect(mockAuthUserService.getModerator).toHaveBeenCalledWith(moderatorDto);
    });

    it('debería lanzar BadRequestException si la contraseña es incorrecta', async () => {
      const moderatorDto: ModeratorLoginAuthDto = { email: 'ana@example.com', password: 'contraseñaIncorrecta' };
      const moderator = { id: 1, correo: 'ana@example.com', password: 'hashedPassword' };

      mockAuthUserService.getModerator.mockResolvedValue(moderator);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(controller.loginModerator(moderatorDto)).rejects.toThrow(BadRequestException);
      expect(mockAuthUserService.getModerator).toHaveBeenCalledWith(moderatorDto);
      expect(bcrypt.compare).toHaveBeenCalledWith('contraseñaIncorrecta', 'hashedPassword');
    });
  });

  // Pruebas para registerModerator
  describe('registerModerator', () => {
    it('debería registrar un nuevo moderador correctamente', async () => {
      const moderatorDto: ModeratorRegisterAuthDto = {
        nombre: 'Ana',
        apellidos: 'Gómez',
        correo: 'ana@example.com',
        password: 'contraseña123',
      };
      const createdModerator = { id: 1, ...moderatorDto };

      mockAuthUserService.registerModerator.mockResolvedValue(createdModerator);

      const result = await controller.registerModerator(moderatorDto);

      expect(mockAuthUserService.registerModerator).toHaveBeenCalledWith(moderatorDto);
      expect(result).toEqual(createdModerator);
    });
  });

  // Pruebas para upgradeUserToModerator
  describe('upgradeUserToModerator', () => {
    it('debería promover un usuario a moderador correctamente', async () => {
      const userId = 1;
      const newMod = { nombre: 'Juan', apellidos: 'Pérez', correo: 'juan@example.com', password: 'hashedPassword' };
      const createdModerator = { id: 1, ...newMod };

      mockAuthUserService.upgradeUserToModerator.mockResolvedValue(newMod);
      mockAuthUserService.registerModerator.mockResolvedValue(createdModerator);

      const result = await controller.upgradeUserToModerator(userId);

      expect(mockAuthUserService.upgradeUserToModerator).toHaveBeenCalledWith(userId);
      expect(mockAuthUserService.registerModerator).toHaveBeenCalledWith(newMod);
      expect(result).toEqual(createdModerator);
    });
  });

  // Pruebas para upgradeUser
  describe('upgradeUser', () => {
    it('debería incrementar la insignia del usuario correctamente', async () => {
      const userId = 1;
      const updatedUser = { id: 1, insignia: '2' };

      mockAuthUserService.upgradeUser.mockResolvedValue(updatedUser);

      const result = await controller.upgradeUser(userId);

      expect(mockAuthUserService.upgradeUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(updatedUser);
    });
  });

  // Pruebas para getAllUsers
  describe('getAllUsers', () => {
    it('debería devolver todos los usuarios', async () => {
      const users = [{ id: 1 }, { id: 2 }];

      mockAuthUserService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(mockAuthUserService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
});