import { Injectable } from '@angular/core';

export enum LocalStorageKeys {
  UPLOADED_MODELS = 'uploadedModels',
  HAS_UPLOADED_MODEL = 'hasUploadedModel',
  TRANSLATE_LANG = 'translocoLang',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public getLocalItem<T>(key: LocalStorageKeys): T | null {
    const item = globalThis.localStorage?.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch {
      return item as unknown as T;
    }
  }

  public setLocalItem(key: LocalStorageKeys, data: unknown): void {
    globalThis.localStorage?.setItem(key, JSON.stringify(data));
  }

  public removeItem(key: LocalStorageKeys): void {
    globalThis.localStorage?.removeItem(key);
  }
}
