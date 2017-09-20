import {TranslateLoader} from '@ngx-translate/core';
import {Observable} from 'rxjs';

import * as translations_en from '../i18n/en.json';
import * as translations_nl from '../i18n/nl.json';

export class VertcoinTranslationLoader implements TranslateLoader {
  constructor() {
    console.log("Vertcoin Translation Loader Constructor");
  }

  getTranslation(lang: string): Observable<any> {

    console.log("Trying translation", lang);

    switch(lang) {
      case 'nl':
        return Observable.of(translations_nl)
      default:
        return Observable.of(translations_en);
    }
  }
}
