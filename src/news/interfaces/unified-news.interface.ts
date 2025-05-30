/**
 * Унифицированный интерфейс для новостей (локальных и внешних)
 */
export interface UnifiedNews {
  id?: number | string | null;
  title: string;
  content: string;
  description?: string;
  createdAt?: Date;
  publishedAt?: Date;
  author?: any;
  agency?: any;
  category?: any;
  isExternal: boolean;
  sourceType: 'local' | 'external';
  url?: string;
  urlToImage?: string;
}
