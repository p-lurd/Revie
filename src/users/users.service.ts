import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModelName } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { tokenify } from 'src/utils/jwt.token';
import { JwtService } from '@nestjs/jwt';
import { FilteredUserDto } from './dto/filtered-user.dto';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModelName) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;
      const user = await this.userModel.findOne({ email: email });
      if (user) {
        throw new ConflictException('User already exists');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });
      return newUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }


  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.getUserDetails({ email: email });
      if (!user || !user.password) {
        throw new UnauthorizedException('message: wrong email or password');
      }else{
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedException('message: wrong email or password');
        }
        const token = await tokenify(
          this.jwtService,
          user._id.toString(),
          user.email,
        );
        res.cookie('authToken', token, {
          httpOnly: true,
          // Set "secure" to true in production with HTTPS
          secure: false,
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000,
        });
        const filteredUser = plainToInstance(FilteredUserDto, user.toObject(), { excludeExtraneousValues: true, enableImplicitConversion: true  });
        res.status(200).json(filteredUser);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async logout(res: Response) {
    res.clearCookie('authToken', {
      httpOnly: true,
      // Set "secure" to true in production with HTTPS
      secure: process.env.NODE_ENV === 'production', 
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  
  }

  async getUserDetails(identifier) {
    try {
      const user = await this.userModel.findOne(identifier);
      if(!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }

  }
}
