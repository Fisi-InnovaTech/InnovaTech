import { Test, TestingModule } from '@nestjs/testing';
import { InsigniasController } from '../insignias.controller';
import { InsigniasService } from '../insignias.service';
import { PrismaService } from 'src/prisma/prisma.service';


describe('InsigniasController', () => {
  let insigniasController: InsigniasController;
  let insigniasService: InsigniasService;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsigniasController],
      providers: [
        InsigniasService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue({ insignia: '1' }), 
              update: jest.fn().mockResolvedValue({}),
            },
            reporte: {
              count: jest.fn().mockResolvedValue(0),
            },
          },
        },
      ],
    }).compile();

    insigniasController = module.get<InsigniasController>(InsigniasController);
    insigniasService = module.get<InsigniasService>(InsigniasService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(insigniasController).toBeDefined();
  });

  describe('getInsignias', () => {
    it('should call insigniasService.getInsignias with the correct id', async () => {
      const id = 1;
      jest.spyOn(insigniasService, 'getInsignias').mockResolvedValue(['Bienvenido']);
      await insigniasController.getInsignias(id);
      expect(insigniasService.getInsignias).toHaveBeenCalledWith(id);
    });
  });

  describe('updateInsignia', () => {
    it('should call insigniasService.updateInsignia with the correct id', async () => {
      const id = 1;
      const mockInsignia = '5'; 

      jest.spyOn(insigniasService, 'updateInsignia').mockResolvedValue(mockInsignia);

      const result = await insigniasController.updateInsignia(id);

      expect(insigniasService.updateInsignia).toHaveBeenCalledWith(id);
      expect(result).toBe(mockInsignia);
    });
  });
  
 
});