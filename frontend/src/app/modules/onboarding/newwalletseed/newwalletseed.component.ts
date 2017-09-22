import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { WalletService } from '../../../services/wallet.service';
@Component({
  templateUrl: 'newwalletseed.component.html'
})
export class OnboardingNewWalletSeedComponent {
  recoverySeed : string = '';

  constructor(private walletService : WalletService, private settingsService : SettingsService, private router : Router ) {
    if(this.recoverySeed == '') {
      this.recoverySeed = this.walletService.generateNewHDKeyPair();
    }
  }

  next() : void {
    this.router.navigate(['onboarding/verifywalletseed']);
  }
}
