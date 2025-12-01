import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    // req.user contains validated user from JWT
    return {
      userId: req.user.userId,
      email: req.user.email,
    };
  }
}