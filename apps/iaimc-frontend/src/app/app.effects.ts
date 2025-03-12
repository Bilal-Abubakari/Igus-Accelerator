import { MaterialEffects } from 'libs/ui-components/src/materials/store/material.effects';
import { FooterEffects } from '../../../../libs/ui-components/src/model/components/main-footer/store/footer.effects';
import { ContactFormEffects } from 'libs/ui-components/src/contact-form/store/contact-form.effects';
import { ModelListEffects } from 'libs/ui-components/src/model-viewer/store/model-list.effects';

export const appEffects = [
    FooterEffects,
    MaterialEffects,
    ContactFormEffects,
    ModelListEffects
];
