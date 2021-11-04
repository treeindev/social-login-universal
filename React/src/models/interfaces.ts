export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  picture?: string;
  sdk_id: string;
  active: Boolean;
  email: string;
}

export interface SDK {
  getSDKId: () => string;
  initialise: () => Promise<void>;
  getUser: () => Promise<User>;
  logIn: () => Promise<User>;
  logOut: () => void;
}