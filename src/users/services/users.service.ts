import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Сервис для работы с пользователями
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Создание нового пользователя
   * @param createUserDto DTO с данными для создания пользователя
   * @returns Созданный пользователь
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Проверяем, существует ли пользователь с таким именем
    const existingUser = await this.findByUsername(createUserDto.username);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким именем уже существует');
    }

    // Хешируем пароль
    const passwordHash = await this.hashPassword(createUserDto.password);

    // Создаем нового пользователя
    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      passwordHash,
      email: createUserDto.email,
      role: createUserDto.role,
      agencyId: createUserDto.agencyId,
    });

    // Если пользователь READER, у него не должно быть agencyId
    if (newUser.role === UserRole.READER) {
      newUser.agencyId = null;
    }

    return this.usersRepository.save(newUser);
  }

  /**
   * Поиск пользователя по ID
   * @param id ID пользователя
   * @returns Найденный пользователь или null
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['agency'],
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  /**
   * Поиск пользователя по имени пользователя
   * @param username Имя пользователя
   * @returns Найденный пользователь или null
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['agency'],
    });
  }

  /**
   * Хеширование пароля
   * @param password Исходный пароль
   * @returns Хеш пароля
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
