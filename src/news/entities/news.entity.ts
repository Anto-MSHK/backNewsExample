import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Agency } from '../../agencies/entities/agency.entity';
import { Category } from '../../categories/entities/category.entity';

/**
 * Сущность Новость
 * Представляет новостную статью
 */
@Entity()
export class News {
  /**
   * Уникальный идентификатор новости
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Заголовок новости
   */
  @Column()
  title: string;

  /**
   * Содержание новости
   */
  @Column({ type: 'text' })
  content: string;

  /**
   * Время создания новости, заполняется автоматически
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Время последнего обновления новости, заполняется автоматически
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Время публикации новости, может быть null для отложенной публикации
   */
  @Column({ nullable: true })
  publishedAt: Date;

  /**
   * ID автора новости
   */
  @Column()
  authorId: number;

  /**
   * ID агентства новости
   */
  @Column()
  agencyId: number;

  /**
   * ID категории новости
   */
  @Column()
  categoryId: number;

  /**
   * Связь с автором: новость принадлежит одному автору
   */
  @ManyToOne(() => User, (user) => user.news)
  @JoinColumn({ name: 'authorId' })
  author: User;

  /**
   * Связь с агентством: новость принадлежит одному агентству
   */
  @ManyToOne(() => Agency, (agency) => agency.news)
  @JoinColumn({ name: 'agencyId' })
  agency: Agency;

  /**
   * Связь с категорией: новость принадлежит одной категории
   */
  @ManyToOne(() => Category, (category) => category.news)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
