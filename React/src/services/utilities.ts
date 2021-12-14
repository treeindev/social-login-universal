class Utilities {
  public parseURL(search: string): any {
    const query = search.substring(1);
    const vars = query.split('&');
    const parsed: any = {};
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair.length > 1) {
        parsed[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
    }
    return parsed;
  }
}

export const utilities = new Utilities();