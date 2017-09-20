import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';
@Component({
  templateUrl: 'onboarding.component.html'
})
export class OnboardingComponent {
  checkedInitialization : boolean = false;
  noNext : boolean = false;
  noPrevious : boolean = true;
  constructor( private settingsService : SettingsService, private router : Router ) {

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

  onboardingComplete() : void {
    this.settingsService.set('bootstrapStatus', true, () => {
      this.router.navigate(['dashboard']);
    });
  }

}
