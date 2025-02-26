import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface Model {
  id: string;
  name: string;
  previewUrl: string;
  uploadDate: string;
  status: 'uploading' | 'completed' | 'failed';
}

export interface ModelsState extends EntityState<Model> {
  loading: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Model>({
  selectId: (model) => model.id,
});

export const initialState: ModelsState = adapter.getInitialState({
  loading: false,
  error: null,
});
