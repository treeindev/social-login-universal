import { User } from "../models/interfaces";

class LocalStorage {
  private userKey = "LOCAL_USER";

  public getUser(): User | undefined {
    let data = localStorage.getItem(this.userKey);
    if (data) {
      const user: User = JSON.parse(data);

      // A valid user must have an associated SDK ID and be active.
      if (user && user.active && user.sdk_id) {
        return user;
      }
    }
    return undefined;
  }

  public setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  public removeUser(): void {
    localStorage.removeItem(this.userKey);
  }
}

export const localStorageService = new LocalStorage();