import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { News } from '../../news/entities/news.entity';

/**
 * Сущность Агентство
 * Представляет новостное агентство, которое может иметь много пользователей и новостей
 */
@Entity()
export class Agency {
  /**
   * Уникальный идентификатор агентства
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Название агентства, должно быть уникальным
   */
  @Column({ unique: true })
  name: string;

  /**
   * Описание агентства, необязательное поле
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Связь с пользователями: одно агентство может иметь много пользователей
   */
  @OneToMany(() => User, (user) => user.agency)
  users: User[];

  /**
   * Связь с новостями: одно агентство может иметь много новостей
   */
  @OneToMany(() => News, (news) => news.agency)
  news: News[];
}
