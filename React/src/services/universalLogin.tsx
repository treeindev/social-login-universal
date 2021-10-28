export class UniversalLogin {
  public async hasActiveSession(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(()=>{
        resolve(false)
      }, 1000)
    });
  }
}

export const universalLogin = new UniversalLogin();