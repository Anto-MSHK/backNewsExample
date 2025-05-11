import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../common/enums/user-role.enum';
import { Agency } from '../../agencies/entities/agency.entity';
import { News } from '../../news/entities/news.entity';

/**
 * Сущность Пользователь
 * Представляет пользователя системы с различными ролями (Читатель, Автор, Админ)
 */
@Entity()
export class User {
  /**
   * Уникальный идентификатор пользователя
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Имя пользователя для входа, должно быть уникальным
   */
  @Column({ unique: true })
  username: string;

  /**
   * Хэш пароля, исключается из ответов API
   */
  @Column()
  @Exclude()
  passwordHash: string;

  /**
   * Email пользователя, должен быть уникальным, необязательное поле
   */
  @Column({ unique: true, nullable: true })
  email: string;

  /**
   * Роль пользователя: Reader (Читатель), Author (Автор) или Admin (Администратор)
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.READER,
  })
  role: UserRole;

  /**
   * ID агентства, к которому принадлежит пользователь
   * Null для Читателей и Админов, не привязанных к агентству
   */
  @Column({ nullable: true })
  agencyId: number | null;

  /**
   * Связь с агентством: пользователь может принадлежать к одному агентству
   */
  @ManyToOne(() => Agency, (agency) => agency.users, { nullable: true })
  @JoinColumn({ name: 'agencyId' })
  agency: Agency;

  /**
   * Связь с новостями: автор может иметь много новостей
   */
  @OneToMany(() => News, (news) => news.author)
  news: News[];
}
