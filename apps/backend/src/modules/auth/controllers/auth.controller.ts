import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthDto } from '../dtos/create-auth.dto';
import { LoginDto } from '../dtos/login.dto';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { ValidateTokenGuard } from '../guards/validate-token/validate-token.guard';
import { GetUser } from 'src/decorators/get-user/get-user.decorator';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //==========================================================
  //                            REGISTER
  //==========================================================
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBody({ type: CreateAuthDto })
  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    const response = await this.authService.create(createAuthDto);
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30, //30 dias
    });
    res.cookie('accessToken', response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, //15 minutos
    });
    return res.status(201).json({
      message: 'User created successfully',
      secretToken: response.secretToken,
    });
  }

  //==========================================================
  //                            LOGIN
  //==========================================================
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 201, description: 'User logged in successfully' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(loginDto);
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30, //30 dias
    });
    res.cookie('accessToken', response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, //15 minutos
    });
    return res.status(201).json({
      message: 'User logged in successfully',
    });
  }

  //==========================================================
  //                           TICKET
  //==========================================================
  @ApiOperation({ summary: 'Get a ticket for user' })
  @ApiResponse({ status: 201, description: 'Ticket generated successfully' })
  @UseGuards(ValidateTokenGuard)
  @Post('ticket')
  async ticket(@GetUser('userId') userId: string, @Res() res: Response) {
    const ticket = await this.authService.generateTicket(userId);
    return res.status(201).json({
      message: 'Ticket generated successfully',
      ticket,
    });
  }
}
