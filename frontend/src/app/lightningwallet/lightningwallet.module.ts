import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { LightningWalletComponent } from './lightningwallet.component';
import { LightningWalletRoutingModule } from './lightningwallet-routing.module';



@NgModule({
  imports: [
    LightningWalletRoutingModule,
    ChartsModule
  ],
  declarations: [ LightningWalletComponent ]
})
export class LightningWalletModule { }
