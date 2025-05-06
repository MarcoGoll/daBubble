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
import { Channel } from '../../interfaces/channel';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  unsubChannels;
  channels: Channel[] = [];
  firestore: Firestore = inject(Firestore);

  /**
   * Initializes the class instance and subscribes to the channels list.
   * The subscription is stored in `unsubChannels` to allow later unsubscription.
   */
  constructor() {
    this.unsubChannels = this.subChannelsList();
  }

  // ##########################################################################################################
  // DB-Connection
  // ##########################################################################################################
  /**
   * Subscribes to the channels list from the database, ordering by first name.
   * Updates the `channels` array with the fetched data.
   *
   * @returns {Function} Unsubscribe function to stop listening for updates.
   */
  subChannelsList() {
    const q = query(this.getChannelsRef(), orderBy('firstName'));
    return onSnapshot(q, (list) => {
      this.channels = [];
      list.forEach((channel) => {
        this.channels.push(
          this.setChannelObjectWithExtraId(channel.data(), channel.id)
        );
      });
    });
  }

  /**
   * Retrieves a reference to the "channels" collection in Firestore.
   *
   * @returns {CollectionReference} Reference to the "channels" collection.
   */
  getChannelsRef() {
    return collection(this.firestore, 'channels');
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
   * Creates a Channel object from the given data, ensuring all fields have default values. With an specific ID.
   *
   * @param {any} obj - The source object containing channel details.
   * @param {string} id - The unique identifier for the channel.
   * @returns {Channel} A channel object with the provided ID and default values for missing properties.
   */
  setChannelObjectWithExtraId(obj: any, id: string): Channel {
    return {
      id: id,
      name: obj.name || '',
      description: obj.description || '',
      members: obj.members || [],
    };
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from the channels list to prevent memory leaks.
   */
  ngonDestroy() {
    this.unsubChannels();
  }

  // ##########################################################################################################
  // CRUD
  // ##########################################################################################################
  // ######## CREATE ########
  /**
   * Creates a new channel to the Firestore database.
   * After successfully creating the channel, it updates the channel to add the id as attribute
   *
   * @param {Channel} channel - The channel object to be created within the database.
   * @returns {Promise<void>} A promise that resolves when the channel has been created and processed.
   */
  async createChannel(channel: Channel) {
    await addDoc(this.getChannelsRef(), channel)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        //add the id as attribute
        channel.id = docRef?.id;
        this.updateChannel(channel);
      });
  }

  // ######## READ ########
  getChannelById() {} //TODO: tbd.

  // ######## UPDATE ########
  /**
   * Updates an existing channel in the Firestore database based.
   * The channel object is cleaned to exclude the ID field before updating.
   *
   * @param {Channel} channel - The channel object to be updated in the database.
   * @returns {Promise<void>} A promise that resolves once the channel has been updated.
   *
   * @remarks
   * This method uses `getCleanJson()` to remove the ID from the channel object before updating,
   * as the Firestore document ID is not part of the document fields but belongs to the document itself.
   */
  async updateChannel(channel: Channel) {
    if (channel.id) {
      let docRef = this.getSingleDocRef('channels', channel.id);
      await updateDoc(docRef, this.getCleanJson(channel))
        .catch((err) => {
          console.error(err);
        })
        .then(() => {});
    }
  }

  /**
   * Creates a clean JSON representation of a channel object,
   * preserving only its relevant fields.
   *
   * @param {Channel} channel - The channel object to be cleaned.
   * @returns {Object} A new object containing the channel data without extra properties.
   */
  getCleanJson(channel: Channel): {} {
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description,
      members: channel.members,
    };
  }

  // ######## DELETE ########
  /**
   * Deletes a channel from the Firestore database.t.
   *
   * @param {Channel} channel - The channel object to be deleted.
   * @returns {Promise<void>} A promise that resolves once the channel has been deleted and the selection state is updated.
   */
  async deleteChannel(channel: Channel) {
    let colId: string = 'channels';
    let docId: string | undefined = channel.id;

    if (docId) {
      await deleteDoc(this.getSingleDocRef(colId, docId))
        .catch((err) => {
          console.log(err);
        })
        .then(() => {});
    }
  }
}
