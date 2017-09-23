import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';

import { SyncStatusComponent } from './shared/syncstatus.component';
import { BalanceComponent } from './shared/balance.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';
// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

import { VertcoinTranslationLoader } from './shared/translationloader';
import { SharedModule } from './modules/shared/shared.module';

import { SettingsService } from './services/settings.service';
import { WalletService } from './services/wallet.service';
import { StorageService } from './services/storage.service';
import { BlockchainService } from './services/blockchain.service';
import { MiddlewareClientService } from './services/middlewareclient.service';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: VertcoinTranslationLoader
      }
    }),
    SharedModule.forRoot()
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    NAV_DROPDOWN_DIRECTIVES,
    SyncStatusComponent,
    BalanceComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }, BlockchainService, WalletService, SettingsService, StorageService, MiddlewareClientService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
