import { Test, TestingModule } from '@nestjs/testing';
import { AlertasController } from '../alertas.controller';
import { AlertasService } from '../alertas.service';
import { AlertasAuthDto } from '../dto/AlertasAuth.dto';
import { AlertaFiltroDto } from '../dto/AlertaFiltro.dto';
import { ValidationPipe } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadMiddleware } from '../config/upload.middleware';
import { APP_PIPE } from '@nestjs/core';
import { FileInterceptor } from '@nestjs/platform-express';

describe('AlertasController', () => {
  let controller: AlertasController;
  let service: AlertasService;

  const mockAlertasService = {
    createAlerta: jest.fn(dto => ({ id: Date.now(), ...dto })),
    getLocations: jest.fn(() => [{ lat: 0, lng: 0 }]),
    getAlertaByFilter: jest.fn(dto => [dto]),
    getAlertas: jest.fn(() => [{ id: 1, alert: 'test' }]),
    changeState: jest.fn((id, estado) => ({ id, estado })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MulterModule.register(UploadMiddleware.getMulterOptions())],
      controllers: [AlertasController],
      providers: [
        {
          provide: AlertasService,
          useValue: mockAlertasService,
        },
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({ transform: true, whitelist: true }),
        },
      ],
    }).compile();

    controller = module.get<AlertasController>(AlertasController);
    service = module.get<AlertasService>(AlertasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveAlerta', () => {
    it('should save an alert', async () => {
      const dto: AlertasAuthDto = {
        evidencia_imagen: '',
        animal_nombre: 'test animal',
        descripcion: 'test description',
        latitud: 10,
        longitud: 20,
        nombre_reportante: 'reporter name',
        estado: 'test state',
        user_id: 1,
      };

      const result = await controller.saveAlerta(dto, { path: 'path/to/file' } as Express.Multer.File);
      expect(result).toEqual({
        id: expect.any(Number),
        evidencia_imagen: 'path/to/file',
        animal_nombre: 'test animal',
        descripcion: 'test description',
        latitud: 10,
        longitud: 20,
        nombre_reportante: 'reporter name',
        estado: 'test state',
        user_id: 1,
      });
      expect(service.createAlerta).toHaveBeenCalledWith({
        ...dto,
        evidencia_imagen: 'path/to/file',
      });
    });
  });
  describe('getLocation', () => {
    it('should return all locations', async () => {
      const result = await controller.getLocation();
      expect(result).toEqual([{ lat: 0, lng: 0 }]);
      expect(service.getLocations).toHaveBeenCalled();
    });
  });
});