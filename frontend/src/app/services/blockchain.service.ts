import {Injectable, NgZone} from '@angular/core';
import {WalletService} from './wallet.service';
import { MiddlewareClientService } from './middlewareclient.service';
import {Observable, BehaviorSubject} from 'rxjs';
import {BlockchainTransactionSummary} from '../models/blockchaintransactionsummary';
import { TxoCollection } from '../models/middlewaredtos/txocollection';
import { BalanceResponse } from '../models/middlewaredtos/balanceresponse';

@Injectable()
export class BlockchainService {
  private allTransactions : BehaviorSubject<BlockchainTransactionSummary[]>
  private balance : BehaviorSubject<number>

  constructor(private walletService : WalletService, private middlewareClientService : MiddlewareClientService) {
    this.allTransactions = new BehaviorSubject<BlockchainTransactionSummary[]>([]);
    this.balance = new BehaviorSubject<number>(0);

    this.refreshTransactions();
    this.refreshBalance();
  }

  refreshBalance() : void {
    this.balance.next(0);
    var publicKeys = this.walletService.getPublicKeys();

    for(var key of publicKeys) {
      var url = '/blockexplorer/';
      if(key.startsWith('xpub')) {
        url += 'xpubBalance/';
      } else {
        url += 'addressBalance/';
      }
      url += key;
      this.middlewareClientService.get<BalanceResponse>(url).map((value) => {
        this.balance.next(this.balance.value + value.balance);
      }).subscribe();
    }
  }

  refreshTransactions() : void {
    this.allTransactions.next([]);
    var publicKeys = this.walletService.getPublicKeys();

    for(var key of publicKeys) {
      var url = '/blockexplorer/';
      if(key.startsWith('xpub')) {
        url += 'xpubTxos/';
      } else {
        url += 'addressTxos/';
      }
      url += key;
      this.middlewareClientService.get<TxoCollection>(url).map((value) => {
        var transactions : BlockchainTransactionSummary[] = [];

        value.txos.forEach((txo) => {
          if(!txo.address)
          txo.address = key;
          transactions.push({
            received : true,
            address : txo.address,
            value : txo.value,
            txid : txo.txid
          });

          if(txo.spent) {
            transactions.push({
              received : false,
              address : txo.address,
              value : txo.value,
              txid : txo.spentTxID
            });
          }
        });

        var array = this.allTransactions.value;
        array.push(...transactions);
        this.allTransactions.next(array);
      }).subscribe();
    }
  }

  getTransactions() : Observable<BlockchainTransactionSummary[]> {
    return this.allTransactions.asObservable();
  }

  getBalance() : Observable<number> {
    return this.balance.asObservable();
  }

}
