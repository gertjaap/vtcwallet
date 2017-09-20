import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import { WalletService } from '../services/wallet.service';
@Component({
  templateUrl: 'onboarding.component.html'
})
export class OnboardingComponent {
  checkedInitialization : boolean = false;
  disabledNext : boolean = false;
  disabledFinish : boolean = false;
  disabledPrevious : boolean = false;
  step : string = 'intro';
  recoverySeed : string = '';
  checkPhrase : string = '';
  serverName : string = "";
  serverType : string = '';
  servers : { name: string, location: string, hostName : string }[] = [
    { name : "vtc.xchan.gr", location: "Europe (Netherlands)", hostName: "vtc.xchan.gr" }
  ];
  constructor(private walletService : WalletService, private changeDetectorRef : ChangeDetectorRef, private settingsService : SettingsService, private router : Router ) {

  }

  ngOnInit() : void {


    this.settingsService.get('bootstrapStatus', (value : any) => {
      if(value === true) {
        // Already bootstrapped, go to dashboard
        this.router.navigate(['dashboard']);
      }
      else {
        this.checkedInitialization = true;
      }
    });
  }

  next() : void {
    switch(this.step) {
      case 'intro':
        this.step = 'conntype';
        break;
      case 'pickServer':
        this.step = 'createWallet';
        break;
      case 'newWalletSeed':
        this.step = 'walletSeedCheck';
        break;
      case 'walletSeedCheck':
        this.step = 'setPassword';
        break;
    }
    this.prepareStep();
    this.changeDetectorRef.detectChanges();
  }

  previous() : void {
    switch(this.step) {
      case 'conntype':
        this.step = 'intro';
        break;
      case 'createWallet':
        if(this.serverType == 'trusted')
          this.step = 'pickServer';
        else
          this.step = 'conntype';
        break;
      case 'newWalletSeed':
        this.step = 'createWallet';
        break;
      case 'walletSeedCheck':
        this.step = 'newWalletSeed';
        break;
    }
    this.prepareStep();
    this.changeDetectorRef.detectChanges();
  }

  chooseTrustedServer() : void {
    this.settingsService.set('serverType', 'trusted', () => {
      console.log("Set server type. Now doing Next");
      this.serverType = 'trusted';
      this.step = 'pickServer';
      this.prepareStep();
      this.changeDetectorRef.detectChanges();
    });
  }

  chooseStandalone() : void {
    this.settingsService.set('serverType', 'standalone', () => {
      this.settingsService.set('server', 'http://localhost:3001/', () => {
        this.serverType = 'standalone';
        this.step = 'createWallet';
        this.prepareStep();
        this.changeDetectorRef.detectChanges();
      });
    });
  }

  prepareStep() : void {

  }

  verifySeedPhrase() : void {
    if(this.checkPhrase !== this.recoverySeed) {
      alert('Seed wrong. Try again.');
    } else {
      this.step = 'setPassword';

    }
  }

  chooseNewWallet() : void {
    if(this.recoverySeed == '') {
      this.recoverySeed = this.walletService.generateNewHDKeyPair();
    }
    this.step = 'newWalletSeed';
    this.prepareStep();
    this.changeDetectorRef.detectChanges();
  }

  finish() : void {
    this.settingsService.set('bootstrapStatus', true, () => {
      this.router.navigate(['dashboard']);
    });
  }

}
