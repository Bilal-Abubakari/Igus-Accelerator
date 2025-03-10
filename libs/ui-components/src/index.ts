import * as feedBackI18n from './model/components/main-footer/components/thank-you-feedback/feedback.i18n.json';
import * as footerI18n from './model/components/main-footer/footer.i18n.json';
import * as footerSubscriptionI18n from './landing-page/components/footer/footer.i18n.json';
import * as langSwticherI18n from './language-switcher/lang-switcher.i18n.json';
import * as modelListI18n from './model/components/model-list/model-list.i18n.json';
import * as modelUploadI18n from './model/components/model-upload/model-upload.i18n.json';
import * as navBarI18n from './navbar/navbar.i18n.json';
import * as stageI18n from './stage/stage.i18n.json';
import * as toolbarI18n from './toolbar/toolbar.i18n.json';

// EXPORT TRANSLOCO
export { toolbarI18n };
export { stageI18n };
export { langSwticherI18n };
export { feedBackI18n };
export { footerI18n, footerSubscriptionI18n };
export { navBarI18n };
export { modelListI18n, modelUploadI18n };

// EXPORT COMPONENT
export * from './model/components/model-list/model-list.component';
export * from './model/components/model-upload/model-upload.component';
export * from './stage/stage.component';
export * from './language-switcher/constants';
export * from './language-switcher/language-switcher.component';
export * from './model/components/main-footer/main-footer.component';
export * from './navbar/navbar.component';
export * from './toolbar/toolbar.component';
