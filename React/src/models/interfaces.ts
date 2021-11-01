export interface User {
  id: String;
  first_name?: String;
  last_name?: String;
  full_name: String;
  picture?: String;
  sdk_id: String;
  active: Boolean;
}

export interface SDK {
  getSDKId: () => String;
  initialise: () => void;
  getUser: () => User;
  logIn: () => User;
  logOut: () => void;
}