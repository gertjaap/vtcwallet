import { NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NumeralPipe } from '../../shared/numeral.pipe';
import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    TranslateModule.forChild(),
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

      constructor(private translate: TranslateService) {

        translate.addLangs(["en", "nl"]);
        translate.setDefaultLang('en');

        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|nl/) ? browserLang : 'en');
    }
 }
