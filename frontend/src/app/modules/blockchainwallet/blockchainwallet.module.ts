import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClient } from '@angular/common/http';

import { BlockchainWalletComponent } from './blockchainwallet.component';
import { BlockchainWalletRoutingModule } from './blockchainwallet-routing.module';
import { BlockchainWalletSendComponent } from './send/send.component';
import { BlockchainWalletReceiveComponent } from './receive/receive.component';
import { BlockchainWalletTransactionHistoryComponent } from './transactionhistory/transactionhistory.component';

import { SettingsService } from '../../services/settings.service';
import { WalletService } from '../../services/wallet.service';
import { StorageService } from '../../services/storage.service';
import { BlockchainService } from '../../services/blockchain.service';
import { MiddlewareClientService } from '../../services/middlewareclient.service';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  imports: [
    BlockchainWalletRoutingModule,
    ChartsModule,
    SharedModule,
  ],
  declarations: [
    BlockchainWalletComponent,
    BlockchainWalletSendComponent,
    BlockchainWalletReceiveComponent,
    BlockchainWalletTransactionHistoryComponent
  ],
  providers: [SettingsService, StorageService, WalletService, BlockchainService, MiddlewareClientService, HttpClient]
})
export class BlockchainWalletModule { }
