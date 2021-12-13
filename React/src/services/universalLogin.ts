import { defaultUser } from "../contexts/userContext";
import { SDK, User } from "../models/interfaces";
import { localStorageService } from "./localStorage";
import { facebookSDK } from "./SDKs/FacebookSDK";
import { googleSDK } from "./SDKs/GoogleSDK";
import { linkedinSDK } from "./SDKs/LinkedinSDK";

export class UniversalLogin {
  private SDKs: Map<String, SDK> = new Map();

  constructor() {
    this.SDKs.set(facebookSDK.getSDKId(), facebookSDK);
    this.SDKs.set(googleSDK.getSDKId(), googleSDK);
    this.SDKs.set(linkedinSDK.getSDKId(), linkedinSDK);
  }

  public getUser(): Promise<User> {
    return new Promise(async (resolve) => {
      const localUser = localStorageService.getUser();

      // A user must be set on local storage in order to get its social profile.
      // Empty user data on local storage initializes the app without an active user.
      if (localUser) {
        const SDK = this.SDKs.get(localUser.sdk_id);
        await SDK?.initialise();
        const user = await SDK?.getUser();

        if (user && user.active) {
          // User status may change between re-renders, local storage must be updated.
          localStorageService.setUser(user);
          resolve(user);
        }
      }

      resolve(defaultUser);
    });
  }

  public login(SDKId: String): Promise<User> {
    return new Promise(async (resolve) => {
      const SDK = this.SDKs.get(SDKId);
      if (SDK) {
        await SDK.initialise();
        const user = await SDK.logIn();
        localStorageService.setUser(user);
        resolve(user);
      }
    });
  }

  public logout(SDKId: String): Promise<any> {
    return new Promise(async (resolve) => {
      const SDK = this.SDKs.get(SDKId);
      if (SDK) {
        await SDK.logOut();
        localStorageService.removeUser();
        resolve(true);
      }
    });
  }
}

export const universalLogin = new UniversalLogin();