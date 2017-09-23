import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { OnboardingComponent } from './onboarding.component';
import { OnboardingIntroComponent } from './intro/intro.component';
import { OnboardingConnectionTypeComponent } from './connectiontype/connectiontype.component';
import { OnboardingPickServerComponent } from './pickserver/pickserver.component';
import { OnboardingCreateWalletComponent } from './createwallet/createwallet.component';
import { OnboardingNewWalletSeedComponent } from './newwalletseed/newwalletseed.component';
import { OnboardingVerifyWalletSeedComponent } from './verifywalletseed/verifywalletseed.component';
import { OnboardingSetWalletPasswordComponent } from './setwalletpassword/setwalletpassword.component';
import { OnboardingLastFewThingsComponent } from './lastfewthings/lastfewthings.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    data: {
      title: 'Onboarding'
    }
  },
  {
    path: 'intro',
    component: OnboardingIntroComponent,
    data: {
      title: 'Intro'
    }
  },
  {
    path: 'connectiontype',
    component: OnboardingConnectionTypeComponent,
    data: {
      title: 'Connection Type'
    }
  },
  {
    path: 'pickserver',
    component: OnboardingPickServerComponent,
    data: {
      title: 'Pick Server'
    }
  },
  {
    path: 'createwallet',
    component: OnboardingCreateWalletComponent,
    data: {
      title: 'Create Wallet'
    }
  },
  {
    path: 'newwalletseed',
    component: OnboardingNewWalletSeedComponent,
    data: {
      title: 'New Wallet Seed'
    }
  },
  {
    path: 'verifywalletseed',
    component: OnboardingVerifyWalletSeedComponent,
    data: {
      title: 'Verify Wallet Seed'
    }
  },
  {
    path: 'setwalletpassword',
    component: OnboardingSetWalletPasswordComponent,
    data: {
      title: 'Set Wallet Password'
    }
  },
  {
    path: 'lastfewthings',
    component: OnboardingLastFewThingsComponent,
    data: {
      title: 'Last Few Things'
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule {}
