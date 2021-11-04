import { defaultUser } from "../../contexts/userContext";
import { SDK, User } from "../../models/interfaces";

declare global {
  interface Window {
    google: any;
  }
}

interface IUserProfile {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}

class GoogleSDK implements SDK {
  private id = "google";
  private HTMLID = "google-sdk";
  private SDKURL = "https://accounts.google.com/gsi/client";
  private profile: IUserProfile | undefined;

  public getSDKId(): string {
    return this.id;
  }

  public async initialise(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById(this.HTMLID)) {
        resolve();
      }

      const HTMLScriptTag: any = document.getElementsByTagName('script')[0];
      const GSDK = document.createElement('script');
      GSDK.src = this.SDKURL;
      GSDK.async = true;
      GSDK.defer = true;

      let afterLogin = (response: any) => {
        const details = response.credential.split(".");
        const profile: IUserProfile = JSON.parse(atob(details[1]));
        if (profile) {
          this.profile = profile;
          resolve();
        }
      }

      GSDK.onload = () => {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_APP_ID,
          callback: afterLogin
        });
        window.google.accounts.id.renderButton(
          document.getElementById("GoogleLoginButton"),
          { theme: "outline", size: "large" }  // customization attributes
        );
        window.google.accounts.id.prompt();
      }

      if (HTMLScriptTag) {
        HTMLScriptTag.parentNode.appendChild(GSDK);
      } else {
        document.appendChild(GSDK);
      }
    });
  }

  public async getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(defaultUser);
    });
  }

  public logIn(): Promise<User> {
    return new Promise((resolve, reject) => {
      if (this.profile) {
        resolve({
          id: this.profile.sub,
          full_name: this.profile.name,
          sdk_id: this.id,
          active: true,
          email: this.profile.email,
          picture: this.profile.picture
        });
      }
    });
  }

  public logOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    })
  }
}

export const googleSDK = new GoogleSDK();