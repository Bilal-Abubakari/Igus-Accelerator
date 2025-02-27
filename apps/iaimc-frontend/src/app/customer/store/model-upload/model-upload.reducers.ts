import { createReducer, on } from '@ngrx/store';

import { ModelsActions } from './model-upload.actions';
import { adapter, initialState } from './model-upload.state';

export const modelsReducer = createReducer(
  initialState,

  on(ModelsActions.uploadModel, (state) => ({
    ...state,
    loading: true,
    uploadedModel: null,
  })),

  on(ModelsActions.uploadModelSuccess, (state, { model }) =>
    adapter.addOne(model, {
      ...state,
      loading: false,
      uploadedModel: model,
    }),
  ),

  on(ModelsActions.uploadModelFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    uploadedModel: null,
  })),

  on(ModelsActions.loadModels, (state) => ({
    ...state,
    loading: true,
  })),

  on(ModelsActions.loadModelsSuccess, (state, { models }) =>
    adapter.setAll(models, { ...state, loading: false }),
  ),

  on(ModelsActions.loadModelsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
