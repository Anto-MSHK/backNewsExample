import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { News } from '../../news/entities/news.entity';

/**
 * Сущность Категория
 * Представляет категорию новостей
 */
@Entity()
export class Category {
  /**
   * Уникальный идентификатор категории
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Название категории, должно быть уникальным
   */
  @Column({ unique: true })
  name: string;

  /**
   * Связь с новостями: одна категория может иметь много новостей
   */
  @OneToMany(() => News, (news) => news.category)
  news: News[];
}
