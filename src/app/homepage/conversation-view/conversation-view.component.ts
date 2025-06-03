import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ConversationService } from '../../_shared/services/firebase/conversation.service';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../_shared/services/firebase/authentication.service';
import { Message } from '../../_shared/interfaces/message';
import { UserService } from '../../_shared/services/firebase/user.service';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../_shared/services/firebase/channel.service';

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [MatCardModule, FormsModule, CommonModule],
  templateUrl: './conversation-view.component.html',
  styleUrl: './conversation-view.component.scss',
})
export class ConversationViewComponent {
  conversationService = inject(ConversationService);
  authService = inject(AuthenticationService);
  userService = inject(UserService);
  channelService = inject(ChannelService);
  newMessageText: string = '';

  shownDates: Set<string> = new Set();

  checkIsMyMessage(uid: string) {
    return this.authService.currentLoggedInUser?.uid === uid;
  }

  shouldShowDivider(date: string | null): boolean {
    //TODO: true if date not displayed so far / false if date already displayed
    if (!date) return false;
    if (this.shownDates.has(date)) {
      return false;
    } else {
      this.shownDates.add(date);
      return true;
    }
  }

  async createNewMessage() {
    if (this.authService.currentLoggedInUser?.displayName) {
      let newMessage: Message = {
        timestamp: Date.now(),
        sender: this.authService.currentLoggedInUser.uid,
        text: this.newMessageText,
      };
      this.conversationService
        .getCurrentConversation()
        .messageBlock.messages.push(newMessage);
      this.conversationService.addMessageDates(newMessage.timestamp);
      await this.conversationService.updateConversation(
        this.conversationService.getCurrentConversation()
      );
    }
  }

  getChannelName() {
    return this.channelService.channels.find(
      (channel) =>
        channel.id ==
        this.conversationService.getCurrentConversation().channelId
    )?.name;
  }

  // TODO: Determine Members Name
  getChannelMembers() {
    return this.channelService.channels.find(
      (channel) =>
        channel.id ==
        this.conversationService.getCurrentConversation().channelId
    )?.members;
  }
}
