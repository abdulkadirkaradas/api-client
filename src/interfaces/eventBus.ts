export type EventCallback = (...args: any[]) => void;
export type EventType = "regular" | "auth" | "method";

export type EventEntry = {
  callback: EventCallback;
  priority: number;
  dependencies: string[];
};

export type EventMap = Record<EventType, Map<string, EventEntry[]>>;