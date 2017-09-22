import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { VertDocsComponent } from './vertdocs.component';

const routes: Routes = [
  {
    path: '',
    component: VertDocsComponent,
    data: {
      title: 'VertDocs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VertDocsRoutingModule {}
