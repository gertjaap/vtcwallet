import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'vertcoin-syncstatus',
  template: `<div class='blockHeight'>{{blockHeight}}</div>`
})
export class SyncStatusComponent {
  blockHeight : number;

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    // Make the HTTP request:
    this.http.get('http://localhost:3001/status/blockHeight').subscribe(data => {
      // Read the result field from the JSON response.
      this.blockHeight = data['blockHeight'];
    });
  }


}
