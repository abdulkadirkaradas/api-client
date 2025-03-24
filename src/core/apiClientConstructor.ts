import axios, { AxiosInstance } from 'axios';
import { APIClientConfig } from '../interfaces/core';
import { EventBus } from '../utils/eventBus/EventBus';

export class APIClientConstructor {
    protected client: AxiosInstance;
    protected eventBus: EventBus;

    constructor(config: APIClientConfig) {
        this.client = axios.create(config);
        this.eventBus = new EventBus();
    }

    public getInstance() {
        return this.client as AxiosInstance;
    }

    public getEventBusInstance() {
        return this.eventBus as EventBus;
    }
}