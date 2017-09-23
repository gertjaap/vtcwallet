import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { BlockchainWalletComponent } from './blockchainwallet.component';
import { BlockchainWalletSendComponent } from './send/send.component';
import { BlockchainWalletReceiveComponent } from './receive/receive.component';
import { BlockchainWalletTransactionHistoryComponent } from './transactionhistory/transactionhistory.component';

const routes: Routes = [
  {
    path: '',
    component: BlockchainWalletComponent,
    data: {
      title: 'Blockchain Wallet'
    }
  },{
    path: 'send',
    component: BlockchainWalletSendComponent,
    data: {
      title: 'Send'
    }
  },{
    path: 'receive',
    component: BlockchainWalletReceiveComponent,
    data: {
      title: 'Receive'
    }
  },{
    path:'transactionhistory',
    component : BlockchainWalletTransactionHistoryComponent,
    data : {
      title : 'Transaction History'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockchainWalletRoutingModule {}
