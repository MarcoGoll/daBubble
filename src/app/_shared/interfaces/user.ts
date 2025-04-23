export interface User {
  id?: string; // ? optional
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarId: number;
  isloggedIn: boolean;
  uid: string;
}
