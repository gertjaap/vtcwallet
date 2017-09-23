import { Component } from '@angular/core';
import 'rxjs/add/operator/filter';
import { BlockchainService } from '../services/blockchain.service';

@Component({
  selector: 'vertcoin-balance',
  template: `<div class="balance"><span class="balanceFull">{{full | numeralPipe : '0,0'}}.</span><span class="balanceFractions">{{fractions | numeralPipe : '00000000'}}</span> VTC</div>`
})
export class BalanceComponent {
  full : number = 0;
  fractions: number = 0;
  constructor(private blockchainService : BlockchainService) {
    blockchainService.getBalance().subscribe((value) => {
      this.full = Math.floor(value);
      this.fractions = (value-this.full)*10000000;
    });
    blockchainService.refreshBalance();

  }
}
