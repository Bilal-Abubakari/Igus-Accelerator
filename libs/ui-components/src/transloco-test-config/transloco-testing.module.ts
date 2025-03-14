import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';
import scheduleCall from '../landing-page/schedule-call/schedule-call.i18n.json';
import materialSelectionI18n from '../landing-page/material-selection/material-selection.i18n.json';
import langSwticherI18n from '../language-switcher/lang-switcher.i18n.json';

export function getTranslocoModule(options: TranslocoTestingOptions = {}) {
  const { langs, translocoConfig, ...rest } = options;
  return TranslocoTestingModule.forRoot({
    langs: {
      scheduleACall: scheduleCall,
      materialSelectionI18n: materialSelectionI18n,
      langSwticherI18n: langSwticherI18n,
    },
    translocoConfig: {
      availableLangs: ['es', 'en', 'fr', 'de', 'pt'],
      defaultLang: 'en',
      ...translocoConfig,
    },
    ...rest,
  });
}
