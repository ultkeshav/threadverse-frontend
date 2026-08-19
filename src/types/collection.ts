export interface Collection {
  collectionId: number;
  name: string;
  description?: string;
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
}

export interface UpdateCollectionRequest {
  name: string;
  description?: string;
}