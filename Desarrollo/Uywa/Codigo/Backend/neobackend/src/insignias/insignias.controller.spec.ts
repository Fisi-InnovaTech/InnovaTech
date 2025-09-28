import { Test, TestingModule } from '@nestjs/testing';
import { InsigniasController } from './insignias.controller';
import { InsigniasService } from './insignias.service';

describe('InsigniasController', () => {
  let controller: InsigniasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsigniasController],
      providers: [InsigniasService],
    }).compile();

    controller = module.get<InsigniasController>(InsigniasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
