import { createReducer, on } from '@ngrx/store';
import { ModelListActions } from './model-list.actions';
import {
  initialModelListState,
  modelListAdapter,
  MODEL_LIST_FEATURE_KEY,
} from './model-list.state';

export { MODEL_LIST_FEATURE_KEY };

export const modelListReducer = createReducer(
  initialModelListState,
  on(ModelListActions.loadModelList, (state) => ({
    ...state,
    loading: true,
    errorFetchingModel: null,
  })),
  on(ModelListActions.loadModelListSuccess, (state, { modelList = [] }) => {
    if (Array.isArray(modelList)) {
      return modelListAdapter.setAll(modelList, {
        ...state,
        loading: false,
        triggerModelFetch: false,
      });
    } else {
      return state;
    }
  }),
  on(
    ModelListActions.loadModelListFailure,
    (state, { errorFetchingModel }) => ({
      ...state,
      loading: false,
      errorFetchingModel,
    }),
  ),
  on(ModelListActions.addModel, (state, { model }) =>
    modelListAdapter.addOne(model, state),
  ),
  on(ModelListActions.updateModelSnapshotSuccess, (state, { model }) =>
    modelListAdapter.updateOne(
      {
        id: model.id,
        changes: { snapshot: model.snapshot },
      },
      state,
    ),
  ),
   on(ModelListActions.setUploadStatus, (state, { hasModelUploaded }) => ({
    ...state,
    hasModelUploaded,
  })),
);
