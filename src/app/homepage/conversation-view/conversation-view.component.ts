import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ConversationService } from '../../_shared/services/firebase/conversation.service';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../_shared/services/firebase/authentication.service';
import { Message } from '../../_shared/interfaces/message';
import { UserService } from '../../_shared/services/firebase/user.service';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../_shared/services/firebase/channel.service';
import { User } from '../../_shared/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DialogEditChannelComponent } from '../../dialogs/dialog-edit-channel/dialog-edit-channel.component';
import { DialogAddUserToChannelComponent } from '../../dialogs/dialog-add-user-to-channel/dialog-add-user-to-channel.component';
import { DialogCurrentUserWithinChannelComponent } from '../../dialogs/dialog-current-user-within-channel/dialog-current-user-within-channel.component';

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [
    MatCardModule,
    FormsModule,
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
  ],
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

  constructor(public dialog: MatDialog) {}

  checkIsMyMessage(uid: string) {
    return this.authService.currentLoggedInUser?.uid === uid;
  }

  shouldShowDivider(date: string | null): boolean {
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

  getChannelMembers() {
    let memberUids: string[] | undefined = this.channelService.channels.find(
      (channel) =>
        channel.id ==
        this.conversationService.getCurrentConversation().channelId
    )?.members;
    let foundMembers: User[] = [];
    if (memberUids) foundMembers = this.userService.getUserByUids(memberUids);
    return foundMembers;
  }

  openDialogEditChannel() {
    (document.activeElement as HTMLElement)?.blur(); // Entfernt Fokus vom aktiven Element
    this.dialog.open(DialogEditChannelComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }

  openDialogAddUserToChannel() {
    (document.activeElement as HTMLElement)?.blur(); // Entfernt Fokus vom aktiven Element
    this.dialog.open(DialogAddUserToChannelComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }

  openDialogCurrentMember() {
    (document.activeElement as HTMLElement)?.blur(); // Entfernt Fokus vom aktiven Element
    this.dialog.open(DialogCurrentUserWithinChannelComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
