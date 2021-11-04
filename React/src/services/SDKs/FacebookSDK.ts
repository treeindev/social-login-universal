import { defaultUser } from "../../contexts/userContext";
import { SDK, User } from "../../models/interfaces";
declare global {
  interface Window {
      FB:any;
      fbAsyncInit: any;
  }
}

interface IUserStatusResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: {
    accessToken: string;
    data_access_expiration_time?: Number;
    expiresIn?: Number;
    graphDomain?: string;
    reauthorize_required_in: string;
    signedRequest: string;
    userID: string;
  }
}

interface IUserPictureResponse {
  data: {
    height: number;
    is_silhouette: boolean;
    url: string;
    width: number;
  }
}
interface IUserProfileResponse {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  name: string;
  picture: IUserPictureResponse;
}

class FacebookSDK implements SDK {
  private id = "facebook";
  private HTMLID = "facebook-sdk";
  private SDKURL = "https://connect.facebook.net/en_US/sdk.js";

  public getSDKId(): string {
    return this.id;
  }

  public async initialise(): Promise<void> {
    return new Promise((resolve, reject) => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId            : process.env.REACT_APP_FACEBOOK_APP_ID,
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v12.0'
        });

        resolve();
      };
      
      // When SDK has already been initialized
      if (document.getElementById(this.HTMLID)) {
        resolve();
      }

      const HTMLScriptTag: any = document.getElementsByTagName('script')[0];
      const FBSDK = document.createElement('script');
      FBSDK.src = this.SDKURL;
      FBSDK.crossOrigin = "anonymous";
      FBSDK.id = this.HTMLID;

      if (HTMLScriptTag) {
        HTMLScriptTag.parentNode.appendChild(FBSDK);
      } else {
        document.appendChild(FBSDK);
      }
    });
  }

  public async getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      window.FB.getLoginStatus((response: IUserStatusResponse) => {
        if (response.status === "connected") {
          this.getProfileData()
            .then((user: User) => {
              resolve(user);
            })
            .catch((reason: any) => {
              reject()
            });
        } else {
          resolve(defaultUser);
        }
      });
    });
  }

  public logIn(): Promise<User> {
    return new Promise((resolve, reject) => {
      window.FB.login((response: IUserStatusResponse) => {
        if (response.status === "connected") {
          this.getProfileData()
            .then((user: User) => {
              resolve(user);
            })
            .catch((reason: any) => {
              reject()
            });
        } else {
          reject();
        }
      }, {scope: 'public_profile,email'});
    });
  }

  public logOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      window.FB.logout((result: any) => {
        resolve();
      });
    })
  }

  private getProfileData(): Promise<User> {
    return new Promise((resolve, reject) => {
      window.FB.api('/me', 'GET', { fields: 'email,name,id,first_name,last_name,picture,about' },
        (response: IUserProfileResponse) => {
          const user = {
            id: response.id,
            full_name: response.name,
            first_name: response.first_name,
            last_name: response.last_name,
            picture: response.picture.data.url,
            active: true,
            sdk_id: this.id,
            email: response.email
          }

          window.FB.api(`/${user.id}/picture`, 'GET', {"width":"950", "redirect":0},
            (response: IUserPictureResponse) => {
              user.picture = response.data.url;
              resolve(user);
            }
          );
        }
      );
    });
  }
}

export const facebookSDK = new FacebookSDK();