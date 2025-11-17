import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDTO } from './dto/create.user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(protected prismaService: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    const existingUser = await this.getUserByEmail(userData.email);

    if (existingUser) {
      throw new NotFoundException(
        `User with email ${userData.email} already exist`,
      );
    }

    const user = await this.prismaService.user.create({
      data: userData,
    });
    return user;
  }

  async updateUser(
    id: number,
    userData: Partial<CreateUserDTO>,
  ): Promise<User | null> {
    await this.getUserById(id);

    const user = await this.prismaService.user.update({
      where: { id },
      data: userData,
    });

    return user;
  }

  async deleteUser(id: number): Promise<User | null> {
    await this.getUserById(id);

    const user = await this.prismaService.user.delete({
      where: { id },
    });

    return user;
  }
}
