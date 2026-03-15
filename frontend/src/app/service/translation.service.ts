import { Injectable, signal } from '@angular/core';
import { LanguagePref } from '../model/elite.model';

/**
 * TranslationService
 * Lightweight translation wrapper.  Acts as an integration point for
 * ngx-translate (or any i18n library) while also syncing the selected
 * language back to the user profile in the DB via the DataService.
 *
 * The minimal dictionary approach below keeps the project self-contained
 * without requiring an additional npm dependency.
 */
@Injectable({ providedIn: 'root' })
export class TranslationService {
  /** Signal holding the active language preference */
  readonly language = signal<LanguagePref>('en');

  private readonly _translations: Record<string, Record<string, string>> = {
    en: {
      'nav.home': 'Home',
      'nav.community': 'Community',
      'nav.routes': 'Routes',
      'nav.reviews': 'Reviews',
      'nav.profile': 'Profile',
      'theme.toggle': 'Toggle Theme',
      'community.title': 'Travel Stories',
      'review.submit': 'Submit Review',
      'review.average': 'Average Score',
    },
    hi: {
      'nav.home': 'होम',
      'nav.community': 'समुदाय',
      'nav.routes': 'मार्ग',
      'nav.reviews': 'समीक्षाएं',
      'nav.profile': 'प्रोफाइल',
      'theme.toggle': 'थीम बदलें',
      'community.title': 'यात्रा कहानियां',
      'review.submit': 'समीक्षा सबमिट करें',
      'review.average': 'औसत स्कोर',
    },
    ta: {
      'nav.home': 'முகப்பு',
      'nav.community': 'சமுதாயம்',
      'nav.routes': 'வழிகள்',
      'nav.reviews': 'மதிப்புரைகள்',
      'nav.profile': 'சுயவிவரம்',
      'theme.toggle': 'தீம் மாற்று',
      'community.title': 'பயண கதைகள்',
      'review.submit': 'மதிப்பீடு சமர்பிக்க',
      'review.average': 'சராசரி மதிப்பெண்',
    },
  };

  /** Translate a key, falling back to English, then the key itself */
  translate(key: string): string {
    const lang = this.language();
    return (
      this._translations[lang]?.[key] ??
      this._translations['en']?.[key] ??
      key
    );
  }

  /** Change the active language and persist to localStorage */
  setLanguage(lang: LanguagePref): void {
    this.language.set(lang);
    localStorage.setItem('redbus-lang', lang);
  }

  /** Load language preference from localStorage on startup */
  loadStoredLanguage(): void {
    const stored = localStorage.getItem('redbus-lang') as LanguagePref | null;
    if (stored) {
      this.language.set(stored);
    }
  }
}
