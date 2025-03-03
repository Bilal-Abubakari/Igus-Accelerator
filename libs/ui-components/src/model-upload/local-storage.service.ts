import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getLocalItem(key: string) {
    const item = globalThis.localStorage?.getItem(key);
    if (item) return JSON.parse(item);
    return null;
  }

  setLocalItem(key: string, data: unknown) {
    globalThis.localStorage?.setItem(key, JSON.stringify(data));
  }

  removeItem(key: string) {
    globalThis.localStorage?.removeItem(key);
  }
}
