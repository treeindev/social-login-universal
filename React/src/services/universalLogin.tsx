import { SDK, User } from "../models/interfaces";
import { facebookSDK } from "./SDKs/FacebookSDK";

export class UniversalLogin {
  private SDKs: Array<SDK> = [];

  constructor() {
    this.SDKs.push(
      facebookSDK
    );
  }

  public async getUser(): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(()=>{
        resolve(
          this.SDKs[0].getUser()
        )
      }, 1000);
    });
  }

  public async login(SDKId: String): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(()=>{
        const user = this.SDKs[0].getUser();
        user.active = true;
        resolve(user);
      }, 1000);
    });
  }

  public async logout(SDKId: String): Promise<any> {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}

export const universalLogin = new UniversalLogin();