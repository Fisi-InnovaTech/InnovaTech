import { Test, TestingModule } from '@nestjs/testing';
import { InsigniasService } from '../insignias.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('InsigniasService', () => {
  let insigniasService: InsigniasService;
  const MOCK_PASSWORD = 'password'; 
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsigniasService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            reporte: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    insigniasService = module.get<InsigniasService>(InsigniasService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getInsignias', () => {
    it('should return an array of insignias', async () => {
      const id = 1;
      const mockInsignia = {
        id: 1,
        nombre: 'Test',
        apellidos: 'User',
        correo: 'test@example.com',
        dni: 12345678,
        password: MOCK_PASSWORD,
        fecha_nac: new Date(),
        estado: 'active',
        insignia: '123'
      };

      jest.spyOn(prismaService.usuario, 'findUnique').mockResolvedValue(mockInsignia);

      const result = await insigniasService.getInsignias(id);
      expect(prismaService.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: Number(id) },
        select: { insignia: true },
      });
      expect(result).toEqual(['Bienvenido', 'Primeros pasos', 'Amante de los animales']);
    });
  });

  describe('updateInsignia', () => {
    it('should update the insignia based on report count', async () => {
      const id = 1;
      const mockResponse = {
        id: 1,
        nombre: 'Test',
        apellidos: 'User',
        correo: 'test@example.com',
        dni: 12345678,
        password: MOCK_PASSWORD,
        fecha_nac: new Date(),
        estado: 'active',
        insignia: '1'
      };
      const mockReportCount = 50;

      jest.spyOn(prismaService.usuario, 'findUnique').mockResolvedValue(mockResponse);
      jest.spyOn(prismaService.reporte, 'count').mockResolvedValue(mockReportCount);
      jest.spyOn(prismaService.usuario, 'update').mockResolvedValue(mockResponse);

      const result = await insigniasService.updateInsignia(id);

      expect(prismaService.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: Number(id) },
        select: { insignia: true },
      });
      expect(prismaService.reporte.count).toHaveBeenCalledWith({
        where: { user_id: Number(id), estado: 'aprobado' },
      });
      expect(prismaService.usuario.update).toHaveBeenCalledWith({
        where: { id: Number(id) },
        data: { insignia: '12345' },
      });
      expect(result).toBe('12345');
    });
  });
});