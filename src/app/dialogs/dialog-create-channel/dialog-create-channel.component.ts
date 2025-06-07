import { Component, inject } from '@angular/core';
import { ChannelService } from '../../_shared/services/firebase/channel.service';
import { Channel } from '../../_shared/interfaces/channel';
import { Conversation } from '../../_shared/interfaces/conversation';
import { ConversationService } from '../../_shared/services/firebase/conversation.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GlobalMessagesService } from '../../_shared/services/global-messages.service';
import { AuthenticationService } from '../../_shared/services/firebase/authentication.service';

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
  authService = inject(AuthenticationService);
  channelService = inject(ChannelService);
  conversationService = inject(ConversationService);
  globalMessageService = inject(GlobalMessagesService);
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

  /**
   * Validates the provided form, checks for duplicate channel names, and creates a new channel along with its associated conversation.
   * Displays a success message and resets the form if successful.
   *
   * @param {NgForm} ngForm - The Angular form instance for creating a channel.
   * @returns {Promise<void>} - Returns early if the form is invalid or a duplicate channel name exists.
   */
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
        if (this.authService.currentLoggedInUser?.uid) {
          this.channelToCreate.members.push(
            this.authService.currentLoggedInUser.uid
          );
        }
        await this.createChannel();
        await this.createConversation();
        await this.setConversationIdWithinChannel();
        this.globalMessageService.showSnackbarNotification(
          `Channel: ${this.channelName} wurde erfolgreich erstellt.`,
          '',
          'success'
        );
        this.resetCreateChannel(ngForm);
      }
    }
  }

  /**
   * Checks whether a channel with the given name already exists.
   *
   * @param {string} channelName - The name of the channel to check.
   * @returns {boolean} - Returns true if a channel with the same name exists, otherwise false.
   */
  checkIsChannelAlreadyExisting(channelName: string) {
    return this.channelService.isChannelAlreadyExisting(channelName);
  }

  /**
   * Creates a new channel using the current channel data.
   *
   * @returns {Promise<void>}
   */
  async createChannel() {
    await this.channelService.createChannel(this.channelToCreate);
  }

  /**
   * Creates a new conversation linked to the current channel.
   *
   * @returns {Promise<void>}
   */
  async createConversation() {
    this.conversationToCreate.channelId = this.channelToCreate.id;
    await this.conversationService.createConversation(
      this.conversationToCreate
    );
  }

  /**
   * Resets the create channel form and closes the dialog.
   *
   * @param {NgForm} ngForm - The Angular form to be reset.
   */
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

  /**
   * Assigns the conversation ID to the corresponding channel, if both IDs are available.
   *
   * @returns {Promise<void>}
   */
  async setConversationIdWithinChannel() {
    if (this.conversationToCreate.channelId && this.conversationToCreate.id) {
      await this.channelService.setConversationId(
        this.conversationToCreate.channelId,
        this.conversationToCreate.id
      );
    }
  }
}
