import { Client } from "@elastic/elasticsearch";

class ES {
  public static es: ES;
  public client: Client;

  private constructor() {
    if (!this.client) this.client = new Client({ node: "http://es:9200" });
  }

  public static getInstance(): ES {
    if (!ES.es) {
      ES.es = new ES();
    }
    return ES.es;
  }
}

export const es = ES.getInstance();
