import { APIClientConfig } from "../interfaces/core";
import { Methods } from "../methods/methods";
import { APIClientConstructor } from "./apiClientConstructor";

export class APIClient extends APIClientConstructor {
  public methods: Methods;

  constructor(config: APIClientConfig) {
    super(config);

    this.methods = new Methods(this.client);
  }
}
