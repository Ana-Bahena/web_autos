import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registrar locale de español localmente
registerLocaleData(localeEs, 'es');

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};
