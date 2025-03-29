import { AxiosInstance } from "axios";

/**
 * A base class for constructing API methods that utilize an Axios client instance.
 * This class is intended to be extended by other classes to define specific API methods.
 */
export class MethodConstructor {
    protected client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }
}