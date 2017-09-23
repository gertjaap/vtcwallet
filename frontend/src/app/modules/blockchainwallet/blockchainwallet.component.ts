import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockchainService } from '../../services/blockchain.service';
import { BlockchainTransactionSummary } from '../../models/blockchaintransactionsummary';

@Component({
  selector: 'app-blockchainwallet',
  templateUrl: './blockchainwallet.component.html',
  styleUrls: ['./blockchainwallet.component.scss']
})
export class BlockchainWalletComponent implements OnInit {
  full : number = 0;
  fractions : number = 0;
  recentTransactions : BlockchainTransactionSummary[] = [];

  constructor(private blockchainService : BlockchainService, private router : Router) { }

  ngOnInit() {
    this.blockchainService.getTransactions().subscribe((value) => {
      this.recentTransactions = value.slice(1,4);
    });
    this.blockchainService.getBalance().subscribe((value) => {
      this.full = Math.floor(value);
      this.fractions = (value-this.full)*10000000;
    });
    this.blockchainService.refreshTransactions();
    this.blockchainService.refreshBalance();
  }

  send() {
    this.router.navigate(['send']);
  }

  receive() {
    this.router.navigate(['receive']);
  }

}
