import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';


export const appConfig: ApplicationConfig = {
  // providers: [provideHttpClient(),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
  providers: [
    provideHttpClient(),
    provideAnimations(), // Required for toastr animations
    provideToastr({ // Configure toastr globally
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
    provideZoneChangeDetection({ 
      eventCoalescing: true 
    }),
    provideRouter(routes)
  ]
  
};
