import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { OnboardingComponent } from './onboarding.component';
import { OnboardingIntroComponent } from './intro/intro.component';
import { OnboardingConnectionTypeComponent } from './connectiontype/connectiontype.component';
import { OnboardingPickServerComponent } from './pickserver/pickserver.component';
import { OnboardingCreateWalletComponent } from './createwallet/createwallet.component';
import { OnboardingNewWalletSeedComponent } from './newwalletseed/newwalletseed.component';
import { OnboardingVerifyWalletSeedComponent } from './verifywalletseed/verifywalletseed.component';
import { OnboardingSetWalletPasswordComponent } from './setwalletpassword/setwalletpassword.component';
import { OnboardingLastFewThingsComponent } from './lastfewthings/lastfewthings.component';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { SettingsService } from '../../services/settings.service';
import { WalletService } from '../../services/wallet.service';
import { StorageService } from '../../services/storage.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    OnboardingRoutingModule,
    ChartsModule,
    SharedModule
  ],
  declarations: [
    OnboardingComponent,
    OnboardingIntroComponent,
    OnboardingConnectionTypeComponent,
    OnboardingPickServerComponent,
    OnboardingCreateWalletComponent,
    OnboardingNewWalletSeedComponent,
    OnboardingVerifyWalletSeedComponent,
    OnboardingSetWalletPasswordComponent,
    OnboardingLastFewThingsComponent
  ],
  providers: [SettingsService, StorageService, WalletService]
})
export class OnboardingModule { }
