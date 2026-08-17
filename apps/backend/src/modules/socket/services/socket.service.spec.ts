import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';
import { SocketClientService } from './client.service';

describe('SocketClientService', () => {
  let service: SocketClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocketClientService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SocketClientService>(SocketClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
