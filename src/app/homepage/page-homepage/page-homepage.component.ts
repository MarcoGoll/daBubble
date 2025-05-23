import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../_shared/services/firebase/authentication.service';
import { HeaderComponent } from '../../_shared/components/header/header.component';
import { FooterSimpleComponent } from '../../_shared/components/footer-simple/footer-simple.component';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { ConversationViewComponent } from '../conversation-view/conversation-view.component';
import { ThreadDetailComponent } from '../thread-detail/thread-detail.component';
import { GlobalAdjustmentsService } from '../../_shared/services/global-adjustments.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-homepage',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterSimpleComponent,
    ConversationListComponent,
    ConversationViewComponent,
    ThreadDetailComponent,
    CommonModule,
  ],
  templateUrl: './page-homepage.component.html',
  styleUrl: './page-homepage.component.scss',
})
export class PageHomepageComponent {
  authService = inject(AuthenticationService);
  globalAdjustmentsService = inject(GlobalAdjustmentsService);
}
