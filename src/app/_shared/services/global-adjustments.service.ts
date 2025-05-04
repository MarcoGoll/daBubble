import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalAdjustmentsService {
  isConversationListOpen: boolean = true;

  constructor() {}

  toggleIsConversationListOpen() {
    this.isConversationListOpen = !this.isConversationListOpen;
  }
}
