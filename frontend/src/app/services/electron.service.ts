import {Injectable} from '@angular/core';
declare var vtcRenderer: any;

@Injectable()
export class ElectronService {
  constructor() {}
  get ipcRenderer() : any {
    return vtcRenderer.electron.ipcRenderer;
  }
}
