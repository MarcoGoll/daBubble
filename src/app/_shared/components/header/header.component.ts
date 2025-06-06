import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../services/firebase/authentication.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService = inject(AuthenticationService);
}
