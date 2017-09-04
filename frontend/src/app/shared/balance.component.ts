import { Component } from '@angular/core';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'vertcoin-balance',
  template: `<div class="balance"><span class="balanceFull">{{full}}.</span><span class="balanceFractions">{{fractions}}</span> VTC</div>`
})
export class BalanceComponent {
  full : number;
  fractions: number;
  constructor() {
    this.full = 392;
    this.fractions = 38382873;
  }
}
