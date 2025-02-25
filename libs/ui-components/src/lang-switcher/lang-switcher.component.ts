import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { Country } from './interface';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CountryService } from './country.service';

@Component({
  selector: 'app-lang-switcher',
  imports: [CommonModule, MatButton, MatIcon],
  templateUrl: './lang-switcher.component.html',
  styleUrl: './lang-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<LangSwitcherComponent>);
  private countryService = inject(CountryService);
  // private translocoService = inject(TranslocoService);
  public africaMiddleEastIndiaCountries: Country[] = [];
  public asiaPacificCountries: Country[] = [];
  public europeCountries: Country[] = [];

  ngOnInit(): void {
    this.countryService
      .getAfricaMiddleEastIndiaCountries()
      ?.subscribe(
        (countries) => (this.africaMiddleEastIndiaCountries = countries || []),
      );

    this.countryService
      .getAsiaPacificCountries()
      ?.subscribe((countries) => (this.asiaPacificCountries = countries || []));

    this.countryService
      .getEuropeCountries()
      ?.subscribe((countries) => (this.europeCountries = countries || []));
  }

  public close() {
    this.dialogRef.close();
  }

  public setLanguage(lang: string) {
    console.log(lang);
    // this.translocoService.setActiveLang(lang);
  }
}
