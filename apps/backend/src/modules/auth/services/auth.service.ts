import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAuthDto } from '../dtos/create-auth.dto';
import { LoginDto } from '../dtos/login.dto';
import { DatabaseService } from 'src/database/database.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  //======================================================
  //                        Register
  //======================================================

  async create(createAuthDto: CreateAuthDto) {
    const veryfyUser = await this.databaseService.user.findUnique({
      where: {
        email: createAuthDto.email,
      },
    });
    if (veryfyUser) {
      throw new BadRequestException('User already exists');
    }

    //generamos un token secreto para el usuario
    const secretToken = randomBytes(64).toString('hex');
    const secretTokenHash = await bcrypt.hash(secretToken, 10);

    //hasheamos la contraseña
    const passwordHash = await bcrypt.hash(createAuthDto.password, 10);

    //generamos el refresh token
    const refreshToken = randomBytes(64).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    //creamos el usuario
    const user = await this.databaseService.user.create({
      data: {
        name: createAuthDto.name,
        lastName: createAuthDto.lastName,
        email: createAuthDto.email,
        password: passwordHash,
        secretToken: secretTokenHash,
        refreshToken: refreshTokenHash,
      },
    });
    //generamos el token de acceso
    const accessToken = this.jwtService.sign({
      email: user.email,
      userId: user.id,
    });

    return {
      message: 'User created successfully',
      accessToken,
      refreshToken,
      secretToken,
    };
  }

  //==============================================================
  //                               LOGIN
  //==============================================================
  async login(loginDto: LoginDto) {
    //verificamos si el usuario existe
    const user = await this.databaseService.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    //verificamos si la contraseña es correcta
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    //generamos el token de acceso
    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
    //generamos el refresh token
    const refreshToken = randomBytes(64).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    //actualizamos el refresh token del usuario
    await this.databaseService.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshTokenHash,
      },
    });
    return {
      message: 'User logged in successfully',
      accessToken,
      refreshToken: refreshToken,
    };
  }

  //==============================================================
  //                               TICKET
  //==============================================================
  async generateTicket(userId: string) {
    //verificamos si el usuario existe
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const ticket = randomBytes(64).toString('hex');
    const ticketHash = await bcrypt.hash(ticket, 10);
    //actualizamos el ticket del usuario
    await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        tiket: ticketHash,
      },
    });
    return ticket;
  }
}
