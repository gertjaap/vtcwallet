import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AtomicSwapComponent } from './atomicswap.component';
import { AtomicSwapRoutingModule } from './atomicswap-routing.module';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    AtomicSwapRoutingModule,
    ChartsModule,
    SharedModule
  ],
  declarations: [ AtomicSwapComponent ]
})
export class AtomicSwapModule { }
