import { NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule }   from '@angular/forms';

@NgModule({
  imports: [
    TranslateModule,
    FormsModule
  ],
  exports: [
    TranslateModule,
    FormsModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
          return {
              ngModule: SharedModule
          };
      }
 }
