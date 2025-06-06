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

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    setTimeout(() => {
      this.setUserLoginStatus();
    }, 1000);
  }

  setUserLoginStatus() {
    if (this.authService.currentLoggedInUser) {
      this.authService.setUserLoginStatus(
        this.authService.currentLoggedInUser.uid,
        true
      );
      console.log();
    }
  }

  async openDialogCreateChannel() {
    (document.activeElement as HTMLElement)?.blur(); // Entfernt Fokus vom aktiven Element
    this.dialog.open(DialogCreateChannelComponent, {
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
