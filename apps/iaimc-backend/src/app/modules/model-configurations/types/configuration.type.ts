import { ReviewStatus } from '../../../common/types/general.types';

export interface ModelConfiguration {
  id: string;
  material: string;
  quantity: number;
  lifeTime: null | number;
  file: File;
  snapshot?: string | null;
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface File {
  name: string;
  type: string;
  url: string;
  checksum: string;
  assetFolder: string;
  uploadDate: string;
}
