import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { OnboardingComponent } from './onboarding.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { SettingsService } from '../services/settings.service';
import { WalletService } from '../services/wallet.service';
import { StorageService } from '../services/storage.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    OnboardingRoutingModule,
    ChartsModule,
    SharedModule
  ],
  declarations: [ OnboardingComponent ],
  providers: [SettingsService, StorageService, WalletService]
})
export class OnboardingModule { }
