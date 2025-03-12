import { UploadApiResponse } from 'cloudinary';

// export interface UploadResponse {
//   data: {
//     secure_url: string;
//     public_id: string;
//     created_at?: string;
//     display_name: string;
//     original_filename: string;
//   };
// }

export interface UploadResponse {
  data: UploadApiResponse;
}

export interface UploadProgress {
  name: string;
  progress: number;
}

export type UploadEvent = { progress: number } | UploadResponse;

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
