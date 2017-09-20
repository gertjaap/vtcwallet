import {Injectable} from '@angular/core';
declare var vtcRenderer: any;

@Injectable()
export class StorageService {
  constructor() {
    if(vtcRenderer.storage) {
      console.log("Using electron storage, path:", vtcRenderer.storage.getDataPath());
    } else {
      console.log("Using browser's localstorage");
    }

  }

  get(key : string, callback : (value : any) => void) {
    if(vtcRenderer.storage) {
      vtcRenderer.storage.get(key, function(error, data) {
        callback(data);
      });
    } else {
      callback(JSON.parse(localStorage.getItem(key)));
    }
  }

  set(key: string, value : any, callback : () => void) {
    if(vtcRenderer.storage) {
      vtcRenderer.storage.set(key, value, function(error, data) {
        callback();
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      callback();
    }
  }
};
