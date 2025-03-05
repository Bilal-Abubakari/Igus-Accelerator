export interface ModelUploadEvent {
  public_id: string;
  secure_url: string;
  name: string;
  material: string;
  created_at: string;
  display_name: string;
  original_filename: string;
}

export interface FetchModelsResponse {
  data: ModelUploadEvent[];
}
