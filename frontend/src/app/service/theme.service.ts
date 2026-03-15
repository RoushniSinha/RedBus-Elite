import { Injectable, Renderer2, RendererFactory2, signal, computed } from '@angular/core';
import { ThemePref } from '../model/elite.model';

/**
 * ThemeService
 * Uses Angular Signals to manage dark/light theme state.
 * Applies / removes the `.dark` CSS class on <html> for Tailwind's
 * class-based dark-mode strategy (OLED optimised – background #000000).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;

  /** Signal that holds the current theme preference */
  readonly theme = signal<ThemePref>('light');

  /** Derived signal – true when dark mode is active */
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this._applyStoredTheme();
  }

  /** Toggle between light and dark */
  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  /** Explicitly set a theme */
  setTheme(pref: ThemePref): void {
    this.theme.set(pref);
    this._applyClass(pref);
    localStorage.setItem('redbus-theme', pref);
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private _applyStoredTheme(): void {
    const stored = localStorage.getItem('redbus-theme') as ThemePref | null;
    const pref: ThemePref = stored ?? 'light';
    this.theme.set(pref);
    this._applyClass(pref);
  }

  private _applyClass(pref: ThemePref): void {
    const html = document.documentElement;
    if (pref === 'dark') {
      this.renderer.addClass(html, 'dark');
    } else {
      this.renderer.removeClass(html, 'dark');
    }
  }
}
