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
        document.querySelector('body').classList.add('sidebar-hidden');
        this.settingsService.has('introDone', (introDone) => {
          if(!introDone)
            this.router.navigate(['onboarding/intro']);
          else
            this.settingsService.has('serverType', (serverTypeExists) => {
              if(!serverTypeExists)
                this.router.navigate(['onboarding/connectiontype']);
              else
                this.settingsService.get('serverType', (serverType) => {
                  this.settingsService.has('server', (server) => {
                    if(serverType == 'trusted' && !server)
                      this.router.navigate(['onboarding/pickserver']);
                    else
                      this.settingsService.has('wallet', (wallet) => {
                        if(!wallet)
                          this.router.navigate(['onboarding/createwallet']);
                        else
                          this.router.navigate(['onboarding/lastfewthings']);
                      });
                  });
                });
            });
        });
      }
    });
  }

}
