import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { VertDocsComponent } from './vertdocs.component';
import { VertDocsRoutingModule } from './vertdocs-routing.module';



@NgModule({
  imports: [
    VertDocsRoutingModule
  ],
  declarations: [ VertDocsComponent ]
})
export class VertDocsModule { }
