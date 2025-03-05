export interface UploadResponse {
  data: {
    secure_url: string;
    public_id: string;
    created_at?: string;
    display_name: string;
    original_filename: string;
  };
}

export interface UploadProgress {
  progress: number;
}

export type UploadEvent =
  | { progress: number }
  | {
      data: {
        secure_url: string;
        public_id: string;
        created_at?: string;
        display_name: string;
        original_filename: string;
        material?: string;
      };
    };

export interface ModelUpload {
  public_id: string;
  secure_url: string;
  created_at: string;
  display_name: string;
  original_filename: string;
}

export enum UploadDirectory {
  Models = 'models',
}
