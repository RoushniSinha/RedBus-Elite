import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ThemeService } from './service/theme.service';
import { TranslationService } from './service/translation.service';
import { Component } from '@angular/core';

// Stub child components so the test host doesn't need full module imports
@Component({ selector: 'app-navbar', template: '' })
class NavbarStubComponent {}

@Component({ selector: 'app-footer', template: '' })
class FooterStubComponent {}

@Component({ selector: 'app-notification-toast', template: '' })
class NotificationToastStubComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        NavbarStubComponent,
        FooterStubComponent,
        NotificationToastStubComponent,
      ],
      providers: [ThemeService, TranslationService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should contain a router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
