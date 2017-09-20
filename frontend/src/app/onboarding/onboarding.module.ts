import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { OnboardingComponent } from './onboarding.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { SettingsService } from '../services/settings.service';
import { StorageService } from '../services/storage.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    OnboardingRoutingModule,
    ChartsModule,
    CommonModule,
    SharedModule
  ],
  declarations: [ OnboardingComponent ],
  providers: [SettingsService, StorageService]
})
export class OnboardingModule { }
