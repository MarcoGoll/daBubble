export interface User {
  id?: string; // ? optional
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarId: number;
  channelIds: string[];
  isloggedIn: boolean;
  uid: string;
}
