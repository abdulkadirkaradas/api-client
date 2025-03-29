import {
  EventCallback,
  EventType,
  EventMap,
} from "../../interfaces/eventBus";

/**
 * EventBus is a utility class for managing event subscriptions and emissions.
 * It allows subscribing to events, triggering them, and managing dependencies between events.
 */
export class EventBus {
  // Stores all events categorized by their type (e.g., regular, auth, method).
  private events: EventMap = {
    regular: new Map(),
    auth: new Map(),
    method: new Map(),
  };

  /**
   * Subscribes to a specific event.
   * 
   * @param eventName {string} - The name of the event to subscribe to.
   * @param type {EventType} - The type of the event (e.g., regular, auth, method).
   * @param callback {EventCallback} - The callback function to execute when the event is triggered.
   * @param priority {number} - The priority of the event (higher priority callbacks are executed first).
   * @param dependencies {string[]} - A list of event names that must be triggered before this event.
   */
  subscribe(
    eventName: string,
    type: EventType,
    callback: EventCallback,
    priority: number = 0,
    dependencies: string[] = []
  ): void {
    // Retrieve the list of callbacks for the event or initialize an empty list.
    const eventList = this.events[type].get(eventName) || [];
    
    // Add the new callback with its priority and dependencies.
    eventList.push({ callback, priority, dependencies });
    
    // Sort the callbacks by priority in descending order.
    eventList.sort((a, b) => b.priority - a.priority);
    
    // Update the event map with the sorted list of callbacks.
    this.events[type].set(eventName, eventList);
  }

  /**
   * Unsubscribes from a specific event.
   * 
   * @param eventName {string} - The name of the event to unsubscribe from.
   * @param type {EventType} - The type of the event (e.g., regular, auth, method).
   * @param callback {EventCallback} - The callback function to remove from the event.
   */
  unsubscribe(
    eventName: string,
    type: EventType,
    callback: EventCallback
  ): void {
    // Retrieve the list of callbacks for the event.
    const eventList = this.events[type].get(eventName);
    if (eventList) {
      // Filter out the callback to be removed and update the event map.
      this.events[type].set(
        eventName,
        eventList.filter((entry) => entry.callback !== callback)
      );
    }
  }

  /**
   * Triggers a specific event, executing all its callbacks in order of priority.
   * Dependencies are resolved before executing the event's callbacks.
   * 
   * @param eventName {string} - The name of the event to trigger.
   * @param type {EventType} - The type of the event (e.g., regular, auth, method).
   * @param args {any[]} - Additional arguments to pass to the event's callbacks.
   */
  emit(eventName: string, type: EventType, ...args: any[]): void {
    // A set to track events that have already been triggered.
    const emittedEvents = new Set<string>();
    
    // A set to track events that have been processed.
    const processedEvents = new Set<string>();

    // Helper function to recursively trigger events and their dependencies.
    const trigger = (name: string) => {
      // Skip if the event has already been processed.
      if (processedEvents.has(name)) return;

      // Retrieve the list of callbacks for the event.
      const eventList = this.events[type].get(name);
      if (!eventList) return; // Exit if the event does not exist.

      // Mark the event as processed.
      processedEvents.add(name);

      // Iterate through each callback entry in the event list.
      for (const entry of eventList) {
        // Trigger all dependent events first.
        for (const dep of entry.dependencies) {
          if (!processedEvents.has(dep)) {
            trigger(dep);
          }
        }

        // Execute the callback only if all dependencies have been triggered.
        if (entry.dependencies.every((dep) => emittedEvents.has(dep))) {
          entry.callback(...args); // Execute the callback with the provided arguments.
          emittedEvents.add(name); // Mark the event as emitted.
        }
      }
    };

    // Start triggering the specified event.
    trigger(eventName);
  }

  /**
   * Clears all subscriptions for a specific event.
   * 
   * @param type {EventType} - The type of the event (e.g., regular, auth, method).
   * @param eventName {string} - The name of the event to clear.
   */
  clear(type: EventType, eventName: string): void {
    // Remove the event from the map.
    this.events[type].delete(eventName);
  }

  /**
   * Clears all subscriptions for a specific event type.
   * 
   * @param type {EventType} - The type of events to clear (e.g., regular, auth, method).
   */
  clearType(type: EventType): void {
    // Clear all events of the specified type.
    this.events[type].clear();
  }

  /**
   * Clears all subscriptions for all event types.
   */
  clearAll(): void {
    // Iterate through all event types and clear their subscriptions.
    Object.values(this.events).forEach((map) => map.clear());
  }
}
