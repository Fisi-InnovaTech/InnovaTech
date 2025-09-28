import { Test, TestingModule } from '@nestjs/testing';
import { InsigniasService } from './insignias.service';

describe('InsigniasService', () => {
  let service: InsigniasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsigniasService],
    }).compile();

    service = module.get<InsigniasService>(InsigniasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
