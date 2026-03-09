import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ValidateTokenGuard extends AuthGuard('jwt') {}
