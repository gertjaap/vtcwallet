import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { AtomicSwapComponent } from './atomicswap.component';

const routes: Routes = [
  {
    path: '',
    component: AtomicSwapComponent,
    data: {
      title: 'Atomic Swap'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtomicSwapRoutingModule {}
