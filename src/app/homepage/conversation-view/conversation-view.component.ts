import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ConversationService } from '../../_shared/services/firebase/conversation.service';

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './conversation-view.component.html',
  styleUrl: './conversation-view.component.scss',
})
export class ConversationViewComponent {
  conversationService = inject(ConversationService);
}
