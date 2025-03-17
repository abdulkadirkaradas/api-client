import { APIClientConfig } from "../interfaces/core";
import { APIClientConstructor } from "./apiClientConstructor";

export class APIClient extends APIClientConstructor {
    constructor(config: APIClientConfig) {
        super(config);
    }
}