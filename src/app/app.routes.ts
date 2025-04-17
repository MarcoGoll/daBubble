import { Routes } from '@angular/router';
import { PageHomepageComponent } from './homepage/page-homepage/page-homepage.component';
import { PageLoginComponent } from './authentification/page-login/page-login.component';
import { PageSignupComponent } from './authentification/page-signup/page-signup.component';
import { PageLegalNoticeComponent } from './_shared/components/page-legal-notice/page-legal-notice.component';
import { PagePrivacyPolicyComponent } from './_shared/components/page-privacy-policy/page-privacy-policy.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: PageHomepageComponent, canActivate: [authGuard] },
  { path: 'home', component: PageHomepageComponent, canActivate: [authGuard] },
  { path: 'login', component: PageLoginComponent },
  { path: 'signUp', component: PageSignupComponent },
  { path: 'legalNotice', component: PageLegalNoticeComponent },
  { path: 'privacyPolicy', component: PagePrivacyPolicyComponent },

  // Wildcard route for unknown routes
  { path: '**', redirectTo: '/' },
];
