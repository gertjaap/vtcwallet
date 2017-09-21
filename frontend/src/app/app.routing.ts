import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'onboarding',
        loadChildren: './onboarding/onboarding.module#OnboardingModule'
      },
      {
        path: 'blockchainwallet',
        loadChildren: './blockchainwallet/blockchainwallet.module#BlockchainWalletModule'
      },
      {
        path: 'lightningwallet',
        loadChildren: './lightningwallet/lightningwallet.module#LightningWalletModule'
      },
      {
        path: 'atomicswap',
        loadChildren: './atomicswap/atomicswap.module#AtomicSwapModule'
      },
      {
        path: 'docs',
        loadChildren: './vertdocs/vertdocs.module#VertDocsModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
