import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../_shared/services/firebase/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss',
})
export class ConversationListComponent {
  userService = inject(UserService);
}
