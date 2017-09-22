import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
@Component({
  templateUrl: 'pickserver.component.html'
})
export class OnboardingPickServerComponent {
  serverName : string;
  servers : { name: string, location: string, hostName : string }[] = [
    { name : "vtc.xchan.gr", location: "Europe (Netherlands)", hostName: "vtc.xchan.gr" }
  ];
  constructor(private settingsService : SettingsService, private router : Router ) {
    this.settingsService.get('server', (value) => {
      var chosenServer = this.servers.find((s) => { return value === 'https://' + s.hostName + '/'; });
      if(chosenServer)
        this.serverName = chosenServer.name;
    });
  }

  next() : void {
    var hostName = '';
    var chosenServer = this.servers.find((s) => { return s.name === this.serverName; });
    if(chosenServer)
      hostName = 'https://' + chosenServer.hostName + '/';

    this.settingsService.set('server', hostName , () => {
      this.router.navigate(['onboarding/createwallet']);
    });
  }

  previous() : void {
    this.router.navigate(['onboarding/connectiontype']);
  }
}
