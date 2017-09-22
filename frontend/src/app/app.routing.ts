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
        loadChildren: './modules/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'onboarding',
        loadChildren: './modules/onboarding/onboarding.module#OnboardingModule'
      },
      {
        path: 'blockchainwallet',
        loadChildren: './modules/blockchainwallet/blockchainwallet.module#BlockchainWalletModule'
      },
      {
        path: 'lightningwallet',
        loadChildren: './modules/lightningwallet/lightningwallet.module#LightningWalletModule'
      },
      {
        path: 'atomicswap',
        loadChildren: './modules/atomicswap/atomicswap.module#AtomicSwapModule'
      },
      {
        path: 'docs',
        loadChildren: './modules/vertdocs/vertdocs.module#VertDocsModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
