export interface Series {
  seriesId: number;
  name: string;
  description?: string;
  collectionId: number;
  collectionName?: string;
}

export interface CreateSeriesRequest {
  name: string;
  description?: string;
  collectionId: number;
}

export interface UpdateSeriesRequest {
  name: string;
  description?: string;
  collectionId: number;
}