import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
@Component({
  templateUrl: 'receive.component.html'
})
export class BlockchainWalletReceiveComponent {
  serverType : string = '';

  constructor(private settingsService : SettingsService, private router : Router ) {

  }

  chooseTrustedServer() : void {
    this.settingsService.set('serverType', 'trusted', () => {
      this.router.navigate(['onboarding/pickserver']);
    });
  }

  chooseStandalone() : void {
    this.settingsService.set('serverType', 'standalone', () => {
      this.settingsService.set('server', 'http://localhost:3001/', () => {
        this.router.navigate(['onboarding/createwallet']);
      });
    });
  }

  previous() : void {
    this.router.navigate(['onboarding/intro']);
  }
}
