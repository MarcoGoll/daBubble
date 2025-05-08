import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../_shared/services/firebase/channel.service';
import { Channel } from '../../../_shared/interfaces/channel';
import { Conversation } from '../../../_shared/interfaces/conversation';
import { ConversationService } from '../../../_shared/services/firebase/conversation.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dialog-create-channel',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './dialog-create-channel.component.html',
  styleUrl: './dialog-create-channel.component.scss',
})
export class DialogCreateChannelComponent {
  channelService = inject(ChannelService);
  conversationService = inject(ConversationService);
  channelName: string = '';
  channelDescription: string = '';

  channelToCreate: Channel = {
    name: 'TestChannel',
    description: '',
    members: [],
  };
  conversationToCreate: Conversation = {
    messageBlock: { messages: [] },
    type: 'channel',
  };

  constructor(public dialogRef: MatDialogRef<DialogCreateChannelComponent>) {}

  async createChannel(ngForm: NgForm) {
    await this.channelService.createChannel(this.channelToCreate);
    this.conversationToCreate.channelId = this.channelToCreate.id;
    await this.conversationService.createConversation(
      this.conversationToCreate
    );
  }

  /**
   * Closes the dialogue
   */
  closeDialog() {
    this.dialogRef.close();
  }
}
