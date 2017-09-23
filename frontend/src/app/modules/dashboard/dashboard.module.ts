import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SettingsService } from '../../services/settings.service';
import { WalletService } from '../../services/wallet.service';
import { StorageService } from '../../services/storage.service';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule
  ],
  declarations: [ DashboardComponent ],
  providers: [SettingsService, StorageService, WalletService]
})
export class DashboardModule { }
