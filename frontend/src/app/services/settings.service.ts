import {Injectable} from '@angular/core';
import { StorageService } from './storage.service';
declare var vtcRenderer: any;

@Injectable()
export class SettingsService {
  constructor(private storageService : StorageService) {

  }

  get(key : string, callback : (value : any) => void) {
    this.storageService.get("setting_" + key, callback);
  }

  set(key: string, value : any, callback : () => void) {
    this.storageService.set("setting_" + key, value, callback);
  }

  has(key : string, callback : (exists : boolean) => void) {
    this.storageService.has("setting_" + key, callback);
  }
}
