import { NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NumeralPipe } from './numeral.pipe';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    TranslateModule,
    FormsModule,
    MomentModule,
    CommonModule
  ],
  declarations : [NumeralPipe],
  exports: [
    TranslateModule,
    FormsModule,
    MomentModule,
    NumeralPipe,
    CommonModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
          return {
              ngModule: SharedModule
          };
      }
 }
