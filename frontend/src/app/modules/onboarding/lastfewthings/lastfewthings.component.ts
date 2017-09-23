import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
@Component({
  templateUrl: 'lastfewthings.component.html'
})
export class OnboardingLastFewThingsComponent {

  constructor(private settingsService : SettingsService, private router : Router ) {

  }

  ngOnInit() {
    document.querySelector('body').classList.remove('sidebar-hidden');
  }

  finish() : void {
    this.settingsService.set('bootstrapStatus', true, () => {
      this.router.navigate(['dashboard']);
    });
  }
}
