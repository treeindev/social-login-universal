import { Subject } from "rxjs";

import { defaultUser } from "../../contexts/userContext";
import { SDK, User } from "../../models/interfaces";

export const LINKEDIN_SDK_STORAGE_KEY = "linkedin_oauth2_state";
export const LINKEDIN_MESSAGE_KEY = "linkedin_popup";

class LinkedinSDK implements SDK {
  private id = "linkedin";
  private popup: Window | null = null;
  private popUpInterval: number | undefined;
  private userCodeSubject: Subject<string> = new Subject();
  private scope = "r_emailaddress r_liteprofile";
  private storageKey = LINKEDIN_SDK_STORAGE_KEY;
  private oauthURL = "https://www.linkedin.com/oauth/v2/authorization";
  private tokenURL = "https://www.linkedin.com/oauth/v2/accessToken";

  public getSDKId(): string {
    return this.id;
  }

  public async initialise(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    })
  }

  public async getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(defaultUser);
    })
  }

  public logIn(): Promise<User> {
    return new Promise((resolve, reject) => {
      // Close any active pop-up modal.
      this.popup?.close();

      // Open a new pop-up window.
      this.popup = window.open(
        this.generateOAuthUrl(),
        '_blank',
        this.generatePopupDimensions()
      );

      // Clean up any active interval
      if (this.popUpInterval) {
        this.clearPopupInterval();
      }

      // Set a new interval to listen for user closing the login pop-up.
      this.popUpInterval = window.setInterval(() => {
        try {
          if (this.popup && this.popup.closed) {
            this.clearPopupInterval();
            // TODO: Handle user closing the popup.
            console.warn("User has closed the Linkedin login popup");
          }
        } catch (error: any) {
          console.error(error);
          this.clearPopupInterval();
        }
      }, 1000);

      // Add window listeners for getting the user login code
      window.removeEventListener('message', (e: MessageEvent) => this.handlePopupMessage(e), false);
      window.addEventListener('message', (e: MessageEvent) => this.handlePopupMessage(e), false);

      // Subscribe to user code subject, this will execute after user completes login process.
      this.userCodeSubject.subscribe(async (code: string) => {
        console.log("This is the user token: ", code);
        // CORS is not supported for LinkedIn API from a frontend Javascript app.
        // This requires a backend implementation.
      });
      
      // TODO: Remove this promise resolution
      resolve(defaultUser);
    })
  }

  public logOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    })
  }

  private getProfileData(): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(defaultUser);
    })
  }

  private handlePopupMessage(event: MessageEvent): void {
    if (event && event.data && event.data.from === LINKEDIN_MESSAGE_KEY) {
      // TODO: Implement cheks for CSRF attack here.
      
      if (event.data.errorMessage) {
        this.popup?.close();
        // TODO: Implement better UX for errors
        console.error("There has been an error on Linkedin SDK", event.data.errorMessage);
      }

      this.userCodeSubject.next(event.data.code);
      this.popup?.close();
    }
  }
  
  /**
   * Generates a unique string value that is hard to guess.
   * This is used to prevent CSRF attacks.
   */
  private generateRandomState(): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  /**
   * Used to generate the OAuth 2.0 URL expected on Linkedin
   * https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fcontext&tabs=HTTPS
   * @returns 
   */
  private generateOAuthUrl(): string {
    const scopeParam = `&scope=${encodeURI(this.scope)}`;
    const generatedState = this.generateRandomState();
    localStorage.setItem(this.storageKey, generatedState);
    let linkedInAuthLink = `${this.oauthURL}?response_type=code`;
    linkedInAuthLink += `&client_id=${process.env.REACT_APP_LINKEDIN_APP_ID}`;
    linkedInAuthLink += `&redirect_uri=${process.env.REACT_APP_LINKEDIN_REDIRECT_URL}`;
    linkedInAuthLink += `${scopeParam}&state=${generatedState}`;
    return linkedInAuthLink;
  }

  private generatePopupDimensions(width = 600, height = 600): string {
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    return `left=${left},top=${top},width=${width},height=${height}`;
  }

  private clearPopupInterval(): void {
    window.clearInterval(this.popUpInterval);
    this.popUpInterval = undefined;
  }
}

export const linkedinSDK = new LinkedinSDK();