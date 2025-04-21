import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'dabubble-c2fba',
          appId: '1:590127133899:web:6108013c7cd86cc05f174e',
          storageBucket: 'dabubble-c2fba.firebasestorage.app',
          apiKey: 'AIzaSyBN-p9MD39x0VysFeyjrtE9Pas62tMYs0o',
          authDomain: 'dabubble-c2fba.firebaseapp.com',
          messagingSenderId: '590127133899',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
