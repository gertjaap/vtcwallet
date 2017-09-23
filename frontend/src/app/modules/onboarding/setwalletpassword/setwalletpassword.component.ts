import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { WalletService } from '../../../services/wallet.service';

@Component({
  templateUrl: 'setwalletpassword.component.html'
})
export class OnboardingSetWalletPasswordComponent {
  password : string = '';
  verifyPassword : string = '';
  showEmptyPasswordNotice : boolean = false;
  showPasswordsDontMatchNotice : boolean = false;
  busy : boolean = false;
  constructor(private walletService : WalletService,  private settingsService : SettingsService, private router : Router ) {

  }

  previous() : void {
    this.router.navigate(['onboarding/newwalletseed']);
  }

  next() : void {
    this.showEmptyPasswordNotice = false;
    this.showPasswordsDontMatchNotice = false;
    if(this.password == '') {
      this.showEmptyPasswordNotice = true;
    }
    else if(!(this.password == this.verifyPassword)) {
      this.showPasswordsDontMatchNotice = true;
    }
    else
    {
      this.busy = true;
      this.walletService.encryptNewWallet(this.password, () => {
        this.busy = false;
        this.router.navigate(['onboarding/lastfewthings']);
      });
    }
  }
}
