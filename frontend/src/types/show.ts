export interface ShowImage {
  medium: string;
  original: string;
}

export interface ShowRating {
  average: number | null;
}

export interface ShowSummary {
  id: number;
  name: string;
  image: ShowImage | null;
  genres: string[];
  rating: ShowRating;
}

export interface ShowDetail extends ShowSummary {
  url: string;
  summary: string | null;
  status: string;
  premiered: string | null;
  runtime: number | null;
  language: string | null;
  officialSite: string | null;
  network: { name: string } | null;
  webChannel: { name: string } | null;
}

export interface ApiResponse<T> {
  data: T;
}
