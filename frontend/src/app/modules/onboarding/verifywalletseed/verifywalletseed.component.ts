import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { WalletService } from '../../../services/wallet.service';

@Component({
  templateUrl: 'verifywalletseed.component.html'
})
export class OnboardingVerifyWalletSeedComponent {
  serverType : string = '';
  checkPhrase : string = '';

  checkError : boolean = false;
  constructor(private walletService : WalletService,  private settingsService : SettingsService, private router : Router ) {

  }

  previous() : void {
    this.router.navigate(['onboarding/newwalletseed']);
  }

  checkPhraseChange() : void {
    this.checkError = false;
  }

  verifySeedPhrase() : void {
    if(!this.walletService.checkAgainstLastGeneratedMnemonic(this.checkPhrase)) {
      this.checkError = true;
    } else {
      this.router.navigate(['onboarding/setwalletpassword']);
    }
  }
}
