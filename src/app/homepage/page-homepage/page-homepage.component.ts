import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../_shared/services/firebase/authentication.service';

@Component({
  selector: 'app-page-homepage',
  standalone: true,
  imports: [],
  templateUrl: './page-homepage.component.html',
  styleUrl: './page-homepage.component.scss',
})
export class PageHomepageComponent {
  authService = inject(AuthenticationService);
}
