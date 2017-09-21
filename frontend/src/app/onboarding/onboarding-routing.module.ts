import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { OnboardingComponent } from './onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    data: {
      title: 'Onboarding'
    }
  },
  {
    path: 'chooseConnection',
    component: OnboardingComponent,
    data: {
      title: 'Onboarding'
    }
  },
  {
    path: 'selectServer',
    component: OnboardingComponent,
    data: {
      title: 'Onboarding'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule {}
