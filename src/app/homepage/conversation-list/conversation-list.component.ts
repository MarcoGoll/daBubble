import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../_shared/services/firebase/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../_shared/services/firebase/authentication.service';
import { GlobalAdjustmentsService } from '../../_shared/services/global-adjustments.service';
import { ChannelService } from '../../_shared/services/firebase/channel.service';
import { ConversationService } from '../../_shared/services/firebase/conversation.service';
import { DialogCreateChannelComponent } from '../../dialogs/dialog-create-channel/dialog-create-channel.component';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    CommonModule,
  ],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.scss',
})
export class ConversationListComponent implements OnInit {
  authService = inject(AuthenticationService);
  userService = inject(UserService);
  channelService = inject(ChannelService);
  conversationService = inject(ConversationService);
  globalAdjustmentsService = inject(GlobalAdjustmentsService);

  readonly panelOpenStateChannels = signal(false);
  readonly panelOpenStateUser = signal(false);

  /**
   * Component constructor.
   *
   * @param {MatDialog} dialog - Angular Material Dialog service instance used to open dialogs.
   */
  constructor(public dialog: MatDialog) {}

  /**
   * Angular lifecycle hook that is called after the component's data-bound properties have been initialized.
   * Starts a timeout to set the user's login status after 1 second.
   */
  ngOnInit() {
    setTimeout(() => {
      this.setUserLoginStatus();
    }, 1000);
  }

  /**
   * Checks if a user is currently logged in.
   * If so, updates the user's login status to "true" in the authentication service.
   */
  setUserLoginStatus() {
    if (this.authService.currentLoggedInUser) {
      this.authService.setUserLoginStatus(
        this.authService.currentLoggedInUser.uid,
        true
      );
      console.log();
    }
  }

  /**
   * Opens the "Create Channel" dialog.
   * Removes focus from the currently active element before opening the dialog.
   * The dialog opens without automatically focusing or restoring focus.
   */
  async openDialogCreateChannel() {
    (document.activeElement as HTMLElement)?.blur(); // Entfernt Fokus vom aktiven Element
    this.dialog.open(DialogCreateChannelComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
