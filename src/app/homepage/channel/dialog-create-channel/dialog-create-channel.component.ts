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
    conversationId: '',
  };
  conversationToCreate: Conversation = {
    messageBlock: { messages: [] },
    type: 'channel',
  };

  constructor(public dialogRef: MatDialogRef<DialogCreateChannelComponent>) {}

  async submitCreateChannel(ngForm: NgForm) {
    ngForm.control.markAllAsTouched();
    if (ngForm.invalid) {
      return;
    } else {
      if (this.checkIsChannelAlreadyExisting(this.channelName)) {
        ngForm.controls['channelName'].setErrors({
          isDuplicateChannelName: true,
        });
      } else {
        this.channelToCreate.name = this.channelName;
        this.channelToCreate.description = this.channelDescription;
        await this.createChannel();
        await this.createConversation();
        await this.setConversationIdWithinChannel();
        this.resetCreateChannel(ngForm);
      }
    }
  }

  checkIsChannelAlreadyExisting(channelName: string) {
    return this.channelService.isChannelAlreadyExisting(channelName);
  }

  async createChannel() {
    await this.channelService.createChannel(this.channelToCreate);
  }

  async createConversation() {
    this.conversationToCreate.channelId = this.channelToCreate.id;
    await this.conversationService.createConversation(
      this.conversationToCreate
    );
  }

  resetCreateChannel(ngForm: NgForm) {
    ngForm.resetForm();
    this.closeDialog();
  }

  /**
   * Closes the dialogue
   */
  closeDialog() {
    this.dialogRef.close();
  }

  setConversationIdWithinChannel() {
    if (this.conversationToCreate.channelId && this.conversationToCreate.id) {
      this.channelService.setConversationId(
        this.conversationToCreate.channelId,
        this.conversationToCreate.id
      );
    }
  }
}
