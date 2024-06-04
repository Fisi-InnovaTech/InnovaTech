import { Test, TestingModule } from '@nestjs/testing';
import { EventosService } from './eventos.service';

describe('EventosService', () => {
  let service: EventosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventosService],
    }).compile();

    service = module.get<EventosService>(EventosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
