import { Test, TestingModule } from '@nestjs/testing';
import { AlertasService } from '../alertas.service';
import { PrismaClient } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { AlertasAuthDto } from '../dto/AlertasAuth.dto';
import { AlertaFiltroDto } from '../dto/AlertaFiltro.dto';
import axios from 'axios';

// Mock de axios
jest.mock('axios');

describe('AlertasService', () => {
  let service: AlertasService;
  let prisma: PrismaClient;

  // Mock de PrismaClient
  const mockPrisma = {
    reporte: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    usuario: {
      findUnique: jest.fn(),
    },
  };

  // Configuración inicial antes de cada prueba
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertasService,
        { provide: PrismaClient, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AlertasService>(AlertasService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  // Limpieza de mocks después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Pruebas para obtenerRegion
  describe('obtenerRegion', () => {
    it('debería devolver la región correcta basada en latitud y longitud', async () => {
      const latitud = -12.0464;
      const longitud = -77.0428;
      const mockResponse = {
        data: {
          results: [
            {
              address_components: [
                {
                  long_name: 'Lima',
                  types: ['administrative_area_level_1'],
                },
              ],
            },
          ],
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.obtenerRegion(latitud, longitud);
      expect(result).toBe('Lima');
      expect(axios.get).toHaveBeenCalledWith('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${latitud},${longitud}`,
          key: 'AIzaSyBZWT4UW-431B4nv7eJRhjBY9ecJcoYb0M',
        },
      });
    });

    it('debería devolver null si no se encuentra la región', async () => {
      const latitud = -12.0464;
      const longitud = -77.0428;
      const mockResponse = {
        data: {
          results: [],
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.obtenerRegion(latitud, longitud);
      expect(result).toBeNull();
    });

    it('debería manejar errores de la API', async () => {
      const latitud = -12.0464;
      const longitud = -77.0428;

      (axios.get as jest.Mock).mockRejectedValue(new Error('Error en la API'));

      const result = await service.obtenerRegion(latitud, longitud);
      expect(result).toBeNull();
    });
  });

  // Pruebas para createAlerta
  describe('createAlerta', () => {
    it('debería crear una nueva alerta correctamente', async () => {
      const alertaDto: AlertasAuthDto = {
        evidencia_imagen: '/images/evidencia.jpg',
        animal_nombre: 'Perro',
        descripcion: 'Perro perdido',
        latitud: -12.0464,
        longitud: -77.0428,
        nombre_reportante: 'Juan Pérez',
        estado: 'pendiente',
        user_id: 1,
      };
      const createdAlerta = { id: 1, ...alertaDto };

      mockPrisma.reporte.create.mockResolvedValue(createdAlerta);

      const result = await service.createAlerta(alertaDto);

      expect(mockPrisma.reporte.create).toHaveBeenCalledWith({
        data: {
          evidencia_imagen: 'https://innovatech-0rui.onrender.com/images/evidencia.jpg',
          animal_nombre: 'Perro',
          descripcion: 'Perro perdido',
          latitud: -12.0464,
          longitud: -77.0428,
          nombre_reportante: 'Juan Pérez',
          fecha_creacion: expect.any(Date),
          estado: 'pendiente',
          user_id: 1,
        },
      });
      expect(result).toEqual(createdAlerta);
    });

    it('debería lanzar BadRequestException si falla la creación', async () => {
      const alertaDto: AlertasAuthDto = {
        evidencia_imagen: '/images/evidencia.jpg',
        animal_nombre: 'Perro',
        descripcion: 'Perro perdido',
        latitud: -12.0464,
        longitud: -77.0428,
        nombre_reportante: 'Juan Pérez',
        estado: 'pendiente',
        user_id: 1,
      };

      mockPrisma.reporte.create.mockRejectedValue(new Error('Error en la base de datos'));

      await expect(service.createAlerta(alertaDto)).rejects.toThrow(BadRequestException);
    });
  });

  // Pruebas para getLocations
  describe('getLocations', () => {
    it('debería devolver las ubicaciones de alertas aprobadas', async () => {
      const alertas = [
        { id: 1, animal_nombre: 'Perro', evidencia_imagen: 'url', descripcion: 'desc', latitud: -12.0464, longitud: -77.0428 },
      ];

      mockPrisma.reporte.findMany.mockResolvedValue(alertas);

      const result = await service.getLocations();

      expect(mockPrisma.reporte.findMany).toHaveBeenCalledWith({
        where: { estado: 'aprobado' },
        select: {
          id: true,
          animal_nombre: true,
          evidencia_imagen: true,
          descripcion: true,
          latitud: true,
          longitud: true,
        },
      });
      expect(result).toEqual(alertas);
    });

    it('debería lanzar BadRequestException si no hay alertas', async () => {
      mockPrisma.reporte.findMany.mockResolvedValue(null);

      await expect(service.getLocations()).rejects.toThrow(BadRequestException);
    });
  });

  // Pruebas para getAlertaByFilter
  describe('getAlertaByFilter', () => {
    it('debería devolver alertas filtradas por fecha y animal', async () => {
      const filtro: AlertaFiltroDto = {
        fecha_ini: '2023-01-01',
        fecha_fin: '2023-12-31',
        animal: 'Perro',
        region: 'Loreto'
      };
      const alertas = [
        { id: 1, animal_nombre: 'Perro', fecha_creacion: new Date('2023-06-01'), evidencia_imagen: 'url', descripcion: 'desc', latitud: -12.0464, longitud: -77.0428 },
      ];

      mockPrisma.reporte.findMany.mockResolvedValue(alertas);

      const result = await service.getAlertaByFilter(filtro);

      expect(mockPrisma.reporte.findMany).toHaveBeenCalledWith({
        where: {
          estado: 'aprobado',
          fecha_creacion: {
            gte: new Date('2023-01-01'),
            lte: new Date('2023-12-31'),
          },
          animal_nombre: 'Perro',
        },
        select: {
          id: true,
          animal_nombre: true,
          evidencia_imagen: true,
          descripcion: true,
          latitud: true,
          longitud: true,
          fecha_creacion: true,
        },
      });
      expect(result).toEqual(alertas);
    });

    it('debería filtrar por región si se proporciona', async () => {
      const filtro: AlertaFiltroDto = {
        fecha_ini: '2023-01-01',
        fecha_fin: '2023-12-31',
        animal: 'Perro',
        region: 'Loreto'
      };
      const alertas = [
        { id: 1, latitud: -12.0464, longitud: -77.0428, animal_nombre: 'Perro', evidencia_imagen: 'url', descripcion: 'desc', fecha_creacion: new Date() },
      ];

      mockPrisma.reporte.findMany.mockResolvedValue(alertas);
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          results: [
            {
              address_components: [
                {
                  long_name: 'Lima',
                  types: ['administrative_area_level_1'],
                },
              ],
            },
          ],
        },
      });

      const result = await service.getAlertaByFilter(filtro);

      expect(result).toEqual(alertas);
    });
  });

  // Pruebas para getAlertas
  describe('getAlertas', () => {
    it('debería devolver todas las alertas con información del usuario', async () => {
      const alertas = [
        { id: 1, animal_nombre: 'Perro', evidencia_imagen: 'url', descripcion: 'desc', estado: 'aprobado', usuario: { nombre: 'Juan' } },
      ];

      mockPrisma.reporte.findMany.mockResolvedValue(alertas);

      const result = await service.getAlertas();

      expect(mockPrisma.reporte.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          animal_nombre: true,
          evidencia_imagen: true,
          descripcion: true,
          estado: true,
          usuario: {
            select: { nombre: true },
          },
        },
      });
      expect(result).toEqual(alertas);
    });

    it('debería lanzar BadRequestException si no hay alertas', async () => {
      mockPrisma.reporte.findMany.mockResolvedValue(null);

      await expect(service.getAlertas()).rejects.toThrow(BadRequestException);
    });
  });

  // Pruebas para changeState
  describe('changeState', () => {
    it('debería actualizar el estado de una alerta', async () => {
      const id = 1;
      const newEstado = 'aprobado';
      const updatedAlerta = { id, estado: newEstado };

      mockPrisma.reporte.update.mockResolvedValue(updatedAlerta);

      const result = await service.changeState(id, newEstado);

      expect(mockPrisma.reporte.update).toHaveBeenCalledWith({
        where: { id },
        data: { estado: newEstado },
      });
      expect(result).toEqual(updatedAlerta);
    });
  });

  // Pruebas para getAlertsByYear
  describe('getAlertsByYear', () => {
    it('debería devolver alertas de un año específico con región', async () => {
      const year = 2023;
      const alertas = [
        { id: 1, fecha_creacion: new Date('2023-06-01'), latitud: -12.0464, longitud: -77.0428 },
      ];

      mockPrisma.reporte.findMany.mockResolvedValue(alertas);
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          results: [
            {
              address_components: [
                {
                  long_name: 'Lima',
                  types: ['administrative_area_level_1'],
                },
              ],
            },
          ],
        },
      });

      const result = await service.getAlertsByYear(year);

      expect(mockPrisma.reporte.findMany).toHaveBeenCalledWith({
        where: {
          fecha_creacion: {
            gte: new Date('2023-01-01'),
            lt: new Date('2023-12-31'),
          },
        },
        orderBy: {
          fecha_creacion: 'asc',
        },
      });
      expect(result).toEqual([{ ...alertas[0], region: 'Lima' }]);
    });
  });

  // Pruebas para getLatestReports
  describe('getLatestReports', () => {
    it('debería devolver los 10 reportes más recientes del último año', async () => {
      const latestReports = Array(10).fill({ id: 1, fecha_creacion: new Date() });

      mockPrisma.reporte.findMany.mockResolvedValue(latestReports);

      const result = await service.getLatestReports();

      expect(mockPrisma.reporte.findMany).toHaveBeenCalledWith({
        where: {
          fecha_creacion: {
            gte: expect.any(Date),
          },
        },
        orderBy: {
          fecha_creacion: 'desc',
        },
        take: 10,
      });
      expect(result).toEqual(latestReports);
    });
  });
});