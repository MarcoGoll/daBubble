import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ConversationService } from '../../_shared/services/firebase/conversation.service';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../_shared/services/firebase/authentication.service';
import { Message } from '../../_shared/interfaces/message';

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [MatCardModule, FormsModule],
  templateUrl: './conversation-view.component.html',
  styleUrl: './conversation-view.component.scss',
})
export class ConversationViewComponent {
  conversationService = inject(ConversationService);
  authService = inject(AuthenticationService);
  newMessageText: string = '';

  async createNewMessage() {
    if (this.authService.currentLoggedInUser?.displayName) {
      let newMessage: Message = {
        timestamp: Date.now(),
        sender: this.authService.currentLoggedInUser.displayName,
        text: this.newMessageText,
      };
      this.conversationService
        .getCurrentConversation()
        .messageBlock.messages.push(newMessage);
      await this.conversationService.updateConversation(
        this.conversationService.getCurrentConversation()
      );
    }
  }
}
