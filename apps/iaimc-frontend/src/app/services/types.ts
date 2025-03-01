export interface UploadResponse {
  data: {
    url: string;
    public_id: string;
  };
}

export interface UploadProgress {
  progress: number;
}

export interface UploadedModel {
  id: string;
  url: string;
  name: string;
  material: string;
  uploadDate: string;
}

export interface FetchModelsResponse {
  data: UploadedModel[];
}
