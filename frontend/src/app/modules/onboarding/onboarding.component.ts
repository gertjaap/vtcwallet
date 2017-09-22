import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../services/settings.service';
@Component({
  templateUrl: 'onboarding.component.html'
})
export class OnboardingComponent {
  constructor(private changeDetectorRef : ChangeDetectorRef, private settingsService : SettingsService, private router : Router ) {

  }

  ngOnInit() : void {


    this.settingsService.get('bootstrapStatus', (value : any) => {
      if(value === true) {
        // Already bootstrapped, go to dashboard
        this.router.navigate(['dashboard']);
      }
      else {
        this.router.navigate(['onboarding/intro']);
      }
    });
  }

}
