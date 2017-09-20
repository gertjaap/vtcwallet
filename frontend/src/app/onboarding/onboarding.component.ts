import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';
@Component({
  templateUrl: 'onboarding.component.html'
})
export class OnboardingComponent {
  checkedInitialization : boolean = false;
  disabledNext : boolean = false;
  disabledFinish : boolean = false;
  disabledPrevious : boolean = false;
  step : number = 1;
  serverName : string = "";
  maxSteps : number = 4;
  serverType : string = '';
  servers : { name: string, location: string, hostName : string }[] = [
    { name : "vtc.xchan.gr", location: "Europe (Netherlands)", hostName: "vtc.xchan.gr" }
  ];
  constructor(private changeDetectorRef : ChangeDetectorRef, private settingsService : SettingsService, private router : Router ) {

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
    console.log("Increasing step from ", this.step);
    this.step = this.step + 1;
    console.log("Set step to ", this.step);
  }

  previous() : void {
    console.log("Decreasing step from ", this.step);
    this.step = this.step - 1;
    console.log("Set step to", this.step);
  }

  chooseTrustedServer() : void {
    this.settingsService.set('serverType', 'trusted', () => {
      console.log("Set server type. Now doing Next");
      this.serverType = 'trusted';
      this.next();
      this.changeDetectorRef.detectChanges();
    });



  }

  chooseStandalone() : void {
    this.settingsService.set('serverType', 'standalone', () => {
      this.settingsService.set('server', 'http://localhost:3001/', () => {
        this.serverType = 'standalone';
        this.next();
        this.changeDetectorRef.detectChanges();
      });
    });


  }

  finish() : void {
    this.settingsService.set('bootstrapStatus', true, () => {
      this.router.navigate(['dashboard']);
    });
  }

}
