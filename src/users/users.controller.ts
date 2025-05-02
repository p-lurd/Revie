import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { FilteredUserDto } from './dto/filtered-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.create(createUserDto);
    return plainToInstance(FilteredUserDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }


  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = this.usersService.login(loginUserDto, res);
    return plainToInstance(FilteredUserDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return this.usersService.logout(res);
  }
}
