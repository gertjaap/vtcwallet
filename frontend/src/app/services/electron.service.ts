import {Injectable} from '@angular/core';
declare var vtcRenderer: any;

@Injectable()
export default class ElectronService {
  constructor() {}
  get ipcRenderer() : any {
    return vtcRenderer.electron.ipcRenderer;
  }
}
