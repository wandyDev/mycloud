import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import { GetUser } from 'src/decorators/get-user/get-user.decorator';
import { ValidateTokenGuard } from '../auth/guards/validate-token/validate-token.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('servers')
@Controller('servers')
@UseGuards(ValidateTokenGuard)
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get()
  getServers(@GetUser('userId') userId: string) {
    return this.serversService.findAllServers(userId);
  }

  @ApiOperation({ summary: 'Create a new server' })
  @ApiResponse({ status: 201, description: 'Server created successfully' })
  @ApiBody({ type: CreateServerDto })
  @Post()
  createServer(
    @Body() createServerDto: CreateServerDto,
    @GetUser('userId') userId: string,
  ) {
    return this.serversService.createServer(createServerDto, userId);
  }
}
