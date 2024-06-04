import { Test, TestingModule } from '@nestjs/testing';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';

describe('EventosController', () => {
  let controller: EventosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventosController],
      providers: [EventosService],
    }).compile();

    controller = module.get<EventosController>(EventosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
