import * as feedBackI18n from './footer/components/thank-you-feedback/feedback.i18n.json';
import * as footerI18n from './footer/footer.i18n.json';
import * as langSwticherI18n from './language-switcher/lang-switcher.i18n.json';
import * as modelUploadI18n from './model-viewer/model-upload/model-upload.i18n.json';
import * as navBarI18n from './navbar/navbar.i18n.json';
import * as stageI18n from './landing-page/stage/stage.i18n.json';
import * as toolbarI18n from './landing-page/toolbar/toolbar.i18n.json';
import * as materialSelectionI18n from './landing-page/material-selection/material-selection.i18n.json';

export * from './navbar/navbar.component';

export * from './landing-page/toolbar/toolbar.component';
export { toolbarI18n };

export * from './model-viewer/model-list/model-list.component';
export * from './model-viewer/model-upload/model-upload.component';
export * from './model-viewer/services/model-viewer.service';

export * from './landing-page/stage/stage.component';
export * from './language-switcher/constants';
export * from './language-switcher/language-switcher.component';
export { stageI18n };
export { langSwticherI18n };
export * from './footer/footer.component';
export { feedBackI18n };
export { footerI18n };
export { navBarI18n };
export { modelUploadI18n };
export { materialSelectionI18n };

export * from './landing-page/material-selection/material-selection.component';
