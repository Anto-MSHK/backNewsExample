import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UnifiedNews } from '../interfaces/unified-news.interface';
import * as dotenv from 'dotenv';
dotenv.config();
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'your_api_key_here';
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

interface NewsAPIArticle {
  title: string;
  content: string;
  description: string;
  publishedAt: string;
  author: string;
  url: string;
  urlToImage: string;
  source: {
    name: string;
  };
}

@Injectable()
export class ExternalNewsService {
  /**
   * Генерирует ID из заголовка новости
   * @param title Заголовок новости
   * @returns ID в формате строки без больших букв и с подчеркиваниями вместо пробелов
   */
  private generateIdFromTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '')
      .substring(0, 50); // Ограничиваем длину
  }

  async getTopHeadlines(params: {
    q?: string;
    category?: string;
    language?: string;
    country?: string;
    pageSize?: number;
    page?: number;
  }): Promise<UnifiedNews[]> {
    try {
      const response = await axios.get(NEWS_API_URL, {
        params: {
          apiKey: NEWS_API_KEY,
          ...params,
        },
      });

      // Проверяем, что response.data существует и содержит articles
      if (!response.data || !Array.isArray(response.data.articles)) {
        console.warn('Некорректный ответ от NewsAPI');
        return [];
      }

      // Преобразуем к единому формату
      return response.data.articles.map(
        (article: NewsAPIArticle): UnifiedNews => ({
          id: this.generateIdFromTitle(article.title || 'none'),
          title: article.title || 'Без заголовка',
          content: article.content || article.description || '',
          description: article.description,
          publishedAt: new Date(article.publishedAt),
          author: { username: article.author || 'Внешний источник' },
          agency: { name: article.source?.name || 'NewsAPI' },
          category: null,
          isExternal: true,
          sourceType: 'external',
          url: article.url,
          urlToImage: article.urlToImage,
        }),
      );
    } catch (error) {
      console.error('Ошибка при получении новостей из NewsAPI:', error);
      return [];
    }
  }
}
