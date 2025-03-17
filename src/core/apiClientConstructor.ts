import axios, { AxiosInstance } from 'axios';
import { APIClientConfig } from '../interfaces/core';

export class APIClientConstructor {
    protected client: AxiosInstance;

    constructor(config: APIClientConfig) {
        this.client = axios.create(config);
    }

    public getInstance() {
        return this.client as AxiosInstance;
    }
}