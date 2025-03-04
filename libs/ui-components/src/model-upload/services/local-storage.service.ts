import { Injectable } from '@angular/core';

export enum LocalStorageKeys {
  UPLOADED_MODELS = 'uploadedModels',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public getLocalItem<T>(key: LocalStorageKeys): T | null {
    const item = globalThis.localStorage?.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }

  public setLocalItem(key: LocalStorageKeys, data: unknown): void {
    globalThis.localStorage?.setItem(key, JSON.stringify(data));
  }

  public removeItem(key: LocalStorageKeys): void {
    globalThis.localStorage?.removeItem(key);
  }
}
