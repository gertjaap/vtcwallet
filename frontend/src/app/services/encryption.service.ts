import {Injectable} from '@angular/core';

@Injectable()
export class EncryptionService {
  constructor() {}

  decrypt(value : string, password: string) : string {
    return value;
  }

  encrypt(value : string, password : string) : string {
    return value;
  }
}
