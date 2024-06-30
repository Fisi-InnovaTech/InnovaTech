import { Test, TestingModule } from '@nestjs/testing';
import { EventosController } from '../eventos.controller';
import { EventosService } from '../eventos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventoDto } from '../dto/create-evento.dto';
import { UpdateEventoDto } from '../dto/update-evento.dto';

describe('EventosController', () => {
    let controller: EventosController;
    let service: EventosService;
  
    const prismaMock = {
      evento: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [EventosController],
        providers: [
          EventosService,
          {
            provide: PrismaService,
            useValue: prismaMock,
          },
        ],
      }).compile();
  
      controller = module.get<EventosController>(EventosController);
      service = module.get<EventosService>(EventosService);
    });
  
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  
    describe('create', () => {
      it('Debe llamar a eventosService.create con los parametros correctos', async () => {
        const dto: CreateEventoDto = {
          mod_id: 1,
          nombre: 'Evento de prueba',
          descripcion: 'Descripción del evento de prueba',
          imagen: Buffer.from(''),
          fecha: new Date(),
          ubicacion: 'Ubicación de prueba',
          categoria: 'Categoría de prueba',
        };
        const result = {
          id: 1,  
          ...dto,
        };
        const spy = jest.spyOn(service, 'create').mockResolvedValue(result);
        expect(await controller.create(dto)).toBe(result);
        expect(spy).toHaveBeenCalledWith(dto);
      });
    });
  
    describe('findAll', () => {
      it('Debe llamar a eventosService.findAll y retornar correctamente el resultado', async () => {
        const result = [
          {
            id: 1,
            mod_id: 1,
            nombre: 'Evento de prueba',
            descripcion: 'Descripción del evento de prueba',
            imagen: Buffer.from(''),
            fecha: new Date(),
            ubicacion: 'Ubicación de prueba',
            categoria: 'Categoría de prueba',
          },
        ];
        jest.spyOn(service, 'findAll').mockResolvedValue(result);
        expect(await controller.findAll()).toBe(result);
      });
    });
  
    describe('findOne', () => {
      it('Debe llamar a eventosService.findOne con los parametros correctos y retornar el resultado', async () => {
        const id = '1';
        const result = {
          id: 1,
          mod_id: 1,
          nombre: 'Evento de prueba',
          descripcion: 'Descripción del evento de prueba',
          imagen: Buffer.from(''),
          fecha: new Date(),
          ubicacion: 'Ubicación de prueba',
          categoria: 'Categoría de prueba',
        };
        jest.spyOn(service, 'findOne').mockResolvedValue(result);
        expect(await controller.findOne(id)).toBe(result);
      });
    });
  
    describe('update', () => {
      it('Debe llamar a  eventosService.update con los parametros correctos', async () => {
        const id = '1';
        const dto: UpdateEventoDto = {
          nombre: 'Evento de prueba actualizado',
          descripcion: 'Descripción del evento de prueba actualizado',
          imagen: Buffer.from(''),
          fecha: new Date(),
          ubicacion: 'Ubicación de prueba actualizada',
          categoria: 'Categoría de prueba actualizada',
        };
        const result = {
          id: 1,
          mod_id: 1,
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          imagen: dto.imagen,
          fecha: dto.fecha,
          ubicacion: dto.ubicacion,
          categoria: dto.categoria,
        };
        jest.spyOn(service, 'findOne').mockResolvedValue(result); 
        jest.spyOn(service, 'update').mockResolvedValue(result);
        expect(await controller.update(id, dto)).toBe(result);
        expect(service.update).toHaveBeenCalledWith(+id, dto);
      });
    });
  
    describe('remove', () => {
      it('Debe llamar a eventosService.remove con los parametros correctos', async () => {
        const id = '1';
        const result = {
          id: 1,
          mod_id: 1,
          nombre: 'Evento de prueba',
          descripcion: 'Descripción del evento de prueba',
          imagen: Buffer.from(''),
          fecha: new Date(),
          ubicacion: 'Ubicación de prueba',
          categoria: 'Categoría de prueba',
        };
        jest.spyOn(service, 'findOne').mockResolvedValue(result); 
        jest.spyOn(service, 'remove').mockResolvedValue(result);
        expect(await controller.remove(id)).toBe(result);
        expect(service.remove).toHaveBeenCalledWith(+id);
      });
    });
  });