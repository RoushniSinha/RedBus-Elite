import { Component, OnInit } from '@angular/core';
import { ThemeService } from './service/theme.service';
import { TranslationService } from './service/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    public themeService: ThemeService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.translationService.loadStoredLanguage();
  }
}
