import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { LightningWalletComponent } from './lightningwallet.component';

const routes: Routes = [
  {
    path: '',
    component: LightningWalletComponent,
    data: {
      title: 'Lightning Wallet'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LightningWalletRoutingModule {}
