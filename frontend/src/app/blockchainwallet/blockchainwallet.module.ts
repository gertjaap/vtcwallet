import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { BlockchainWalletComponent } from './blockchainwallet.component';
import { BlockchainWalletRoutingModule } from './blockchainwallet-routing.module';



@NgModule({
  imports: [
    BlockchainWalletRoutingModule,
    ChartsModule
  ],
  declarations: [ BlockchainWalletComponent ]
})
export class BlockchainWalletModule { }
