export interface Repository {
  description?: string;
  homepage?: string[] | string;
  url: string;
  language?: string;
  date: string;
  category: string;
  status?: string;
  download?: string;
  platform?: string;
  name: string;
  archived?: boolean;
}
export type Empty = Record<string, never>;
