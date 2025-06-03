import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Conversation } from '../../interfaces/conversation';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  unsubConversations;
  conversations: Conversation[] = [];
  currentConversationType: 'channel' | 'user' | 'empty' = 'empty';

  private currentConversation: Conversation = {
    id: '',
    messageBlock: {
      messages: [
        {
          timestamp: 1746791700000,
          sender: 'Marco',
          text: 'Hallo ich bin Marco',
        },
        {
          timestamp: 1746791800000,
          sender: 'Jürgen',
          text: 'Hallo ich bin Jürgen',
        },
      ],
    },
    type: null,
  };
  allMessageDatesCurrentConversation: string[] = [];
  firestore: Firestore = inject(Firestore);

  /**
   * Initializes the class instance and subscribes to the conversations list.
   * The subscription is stored in `unsubConversations` to allow later unsubscription.
   */
  constructor() {
    this.unsubConversations = this.subConversationsList();
  }

  // ##########################################################################################################
  // DB-Connection
  // ##########################################################################################################
  /**
   * Subscribes to the conversations list from the database, ordering by first name.
   * Updates the `conversations` array with the fetched data.
   *
   * @returns {Function} Unsubscribe function to stop listening for updates.
   */
  subConversationsList() {
    const q = query(this.getConversationsRef());
    return onSnapshot(q, (list) => {
      this.conversations = [];
      list.forEach((conversation) => {
        this.conversations.push(
          this.setConversationObjectWithExtraId(
            conversation.data(),
            conversation.id
          )
        );
      });
    });
  }

  /**
   * Retrieves a reference to the "conversations" collection in Firestore.
   *
   * @returns {CollectionReference} Reference to the "conversations" collection.
   */
  getConversationsRef() {
    return collection(this.firestore, 'conversations');
  }

  /**
   * Retrieves a reference to a single document within a specified Firestore collection.
   *
   * @param {string} colId - The ID of the Firestore collection.
   * @param {string} docId - The ID of the document within the collection.
   * @returns {DocumentReference} Reference to the specified Firestore document.
   */
  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  /**
   * Creates a Conversation object from the given data, ensuring all fields have default values. With an specific ID.
   *
   * @param {any} obj - The source object containing conversation details.
   * @param {string} id - The unique identifier for the conversation.
   * @returns {Conversation} A conversation object with the provided ID and default values for missing properties.
   */
  setConversationObjectWithExtraId(obj: any, id: string): Conversation {
    return {
      id: id,
      messageBlock: obj.messageBlock || { messages: [] },
      type: obj.type || 'channel',
      channelId: obj.channelId || '',
      userIds: obj.userIds || [],
    };
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from the conversations list to prevent memory leaks.
   */
  ngonDestroy() {
    this.unsubConversations();
  }

  // ##########################################################################################################
  // CRUD
  // ##########################################################################################################
  // ######## CREATE ########
  /**
   * Creates a new conversation to the Firestore database.
   * After successfully creating the conversation, it updates the conversation to add the id as attribute
   *
   * @param {Conversation} conversation - The conversation object to be created within the database.
   * @returns {Promise<void>} A promise that resolves when the conversation has been created and processed.
   */
  async createConversation(conversation: Conversation) {
    await addDoc(this.getConversationsRef(), conversation)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        //add the id as attribute
        conversation.id = docRef?.id;
        this.updateConversation(conversation);
      });
  }

  // ######## READ ########
  getConversationById() {} //TODO: tbd.

  // ######## UPDATE ########
  /**
   * Updates an existing conversation in the Firestore database based.
   * The conversation object is cleaned to exclude the ID field before updating.
   *
   * @param {Conversation} conversation - The conversation object to be updated in the database.
   * @returns {Promise<void>} A promise that resolves once the conversation has been updated.
   *
   * @remarks
   * This method uses `getCleanJson()` to remove the ID from the conversation object before updating,
   * as the Firestore document ID is not part of the document fields but belongs to the document itself.
   */
  async updateConversation(conversation: Conversation) {
    if (conversation.id) {
      let docRef = this.getSingleDocRef('conversations', conversation.id);
      await updateDoc(docRef, this.getCleanJson(conversation))
        .catch((err) => {
          console.error(err);
        })
        .then(() => {});
    }
  }

  /**
   * Creates a clean JSON representation of a conversation object,
   * preserving only its relevant fields.
   *
   * @param {Conversation} conversation - The conversation object to be cleaned.
   * @returns {Object} A new object containing the conversation data without extra properties.
   */
  getCleanJson(conversation: Conversation): {} {
    if (conversation.channelId) {
      return {
        id: conversation.id,
        messageBlock: conversation.messageBlock,
        type: conversation.type,
        channelId: conversation.channelId,
      };
    } else {
      return {
        id: conversation.id,
        messageBlock: conversation.messageBlock,
        type: conversation.type,
        userIds: conversation.userIds,
      };
    }
  }

  // ######## DELETE ########
  /**
   * Deletes a conversation from the Firestore database.t.
   *
   * @param {Conversation} conversation - The conversation object to be deleted.
   * @returns {Promise<void>} A promise that resolves once the conversation has been deleted and the selection state is updated.
   */
  async deleteConversation(conversation: Conversation) {
    let colId: string = 'conversations';
    let docId: string | undefined = conversation.id;

    if (docId) {
      await deleteDoc(this.getSingleDocRef(colId, docId))
        .catch((err) => {
          console.log(err);
        })
        .then(() => {});
    }
  }

  // ##########################################################################################################
  // Setter
  // ##########################################################################################################
  setCurrentConversation(conversationId: string) {
    this.currentConversationType = 'channel';
    let foundConversation = this.conversations.find(
      (conversation) => conversation.id === conversationId
    );

    if (foundConversation) {
      this.currentConversation = foundConversation;
      this.fillAllMessageDates();
    }
  }

  // ##########################################################################################################
  // Getter
  // ##########################################################################################################
  getCurrentConversation() {
    return this.currentConversation;
  }

  // OTHERS
  fillAllMessageDates() {
    this.allMessageDatesCurrentConversation = [];
    this.currentConversation.messageBlock.messages.forEach((message) => {
      if (
        !this.allMessageDatesCurrentConversation.includes(
          this.formatDate(message.timestamp)
        )
      ) {
        this.allMessageDatesCurrentConversation.push(
          this.formatDate(message.timestamp)
        );
      }
    });
    console.log(
      'Alle Datumsangaben groupiert: ',
      this.allMessageDatesCurrentConversation
    );
  }

  addMessageDates(timestamp: number) {
    if (
      !this.allMessageDatesCurrentConversation.includes(
        this.formatDate(timestamp)
      )
    ) {
      this.allMessageDatesCurrentConversation.push(this.formatDate(timestamp));
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }
}
