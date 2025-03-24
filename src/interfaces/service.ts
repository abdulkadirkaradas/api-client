import { AxiosInstance } from "axios";
import { AuthorizationTokenConfig } from "./auth";
import { StorageType } from "./storage";
import { EventBus } from "../utils/eventBus/EventBus";

export interface IServiceConstructor {
    client: AxiosInstance;
    eventBus: EventBus;
    tokenConfig?: AuthorizationTokenConfig;
}