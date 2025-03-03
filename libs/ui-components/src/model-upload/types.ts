export interface UploadResponse {
  data: {
    url: string;
    public_id: string;
  };
}

export interface UploadProgress {
  progress: number;
}
