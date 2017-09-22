import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
@Component({
  templateUrl: 'createwallet.component.html'
})
export class OnboardingCreateWalletComponent {
  serverType : string = '';

  constructor(private settingsService : SettingsService, private router : Router ) {

  }

  chooseNewWallet() : void {
    this.router.navigate(['onboarding/newwalletseed']);
  }


}
