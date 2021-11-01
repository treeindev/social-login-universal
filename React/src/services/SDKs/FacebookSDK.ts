import { SDK, User } from "../../models/interfaces";

class FacebookSDK implements SDK {
  private id = "facebook";

  public getSDKId(): String {
    return this.id;
  }

  public initialise(): void {

  }

  public getUser(): User {
    return {
      id: "",
      full_name: "Miquel",
      sdk_id: this.id,
      active: false
    }
  }

  public logIn(): User {
    return {
      id: "",
      full_name: "",
      sdk_id: this.id,
      active: true
    }
  }

  public logOut () {}
}

export const facebookSDK = new FacebookSDK();