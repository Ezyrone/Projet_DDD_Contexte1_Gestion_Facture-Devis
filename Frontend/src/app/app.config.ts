import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { authInitializerProvider } from './core/auth/app-init.provider';
import { authRecoveryInterceptor } from './core/http/auth-recovery.interceptor';
import { credentialsInterceptor } from './core/http/credentials.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor, authRecoveryInterceptor])),
    authInitializerProvider,
  ],
};
