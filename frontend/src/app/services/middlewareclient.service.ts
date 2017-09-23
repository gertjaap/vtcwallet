import {Injectable, NgZone} from '@angular/core';
import {SettingsService} from './settings.service';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import {Observable} from 'rxjs';
import {BlockchainTransactionSummary} from '../models/blockchaintransactionsummary';

@Injectable()
export class MiddlewareClientService {
  server : string = '';
  constructor(private http : HttpClient, private settingsService : SettingsService) {
    this.settingsService.get('server', (value) => {
      this.server = value;
    });
  }

  get<T>(path : string, options? : {
    headers?: HttpHeaders,
    params?: HttpParams,
    reportProgress?: boolean,
    responseType?: 'json',
    withCredentials?: boolean,
  }) : Observable<T> {
      return this.http.get<T>(this.server + path, options);
  }

}
