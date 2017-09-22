import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { BlockchainWalletComponent } from './blockchainwallet.component';

const routes: Routes = [
  {
    path: '',
    component: BlockchainWalletComponent,
    data: {
      title: 'Blockchain Wallet'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockchainWalletRoutingModule {}
