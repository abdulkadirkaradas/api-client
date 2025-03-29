import { AxiosInstance } from "axios";
import { AuthorizationTokenConfig } from "./auth";
import { EventBus } from "../utils/eventBus/EventBus";
import { AuthProtocolConfig } from "./core";

export interface IServiceConstructor {
    client: AxiosInstance;
    eventBus: EventBus;
    authProtocol: AuthProtocolConfig;
    tokenConfig?: AuthorizationTokenConfig;
}