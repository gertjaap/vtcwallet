import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
@Component({
  templateUrl: 'intro.component.html'
})
export class OnboardingIntroComponent {

  constructor(private settingsService : SettingsService, private router : Router ) {

  }

  next() : void {
    this.settingsService.set('introDone', true, () => {
      this.router.navigate(['onboarding/connectiontype']);
    });
  }
}
