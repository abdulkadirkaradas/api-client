import { AxiosInstance } from "axios";

export class MethodConstructor {
    protected client: AxiosInstance;

    constructor(client: AxiosInstance) {
        this.client = client;
    }
}