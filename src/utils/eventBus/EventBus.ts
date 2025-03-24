import {
  EventCallback,
  EventType,
  EventMap,
  EventEntry,
} from "../../interfaces/eventBus";

export class EventBus {
  private events: EventMap = {
    regular: new Map(),
    auth: new Map(),
    method: new Map(),
  };

  private waitingEvents: Map<string, Map<string, any[]>> = new Map();

  /**
   * Checks for cyclic dependencies in the event chain.
   * If a cyclic dependency is detected, it returns true.
   * 
   * @param event - The name of the event being checked.
   * @param eventType - The type of the event (e.g., regular, auth, method).
   * @param dependencies - The list of dependencies for the event.
   * @param visited - A set of events that have already been visited during the check.
   * @returns boolean - True if a cyclic dependency is found, otherwise false.
   */
  private hasCyclicDependency(
    event: string,
    eventType: EventType,
    dependencies: string[],
    visited: Set<string> = new Set()
  ): boolean {
    if (visited.has(event)) return true;

    visited.add(event);
    for (const dep of dependencies) {
      const depEntries = this.events[eventType].get(dep) || [];
      for (const entry of depEntries) {
        if (
          this.hasCyclicDependency(dep, eventType, entry.dependencies, visited)
        ) {
          return true;
        }
      }
    }
    visited.delete(event);
    return false;
  }

  /**
   * Adds an event listener to the event bus.
   * If a cyclic dependency is detected, an error is thrown.
   * 
   * @param event - The name of the event to subscribe to.
   * @param eventType - The type of the event (e.g., regular, auth, method).
   * @param callback - The callback function to execute when the event is triggered.
   * @param priority - The priority of the event listener (higher priority listeners are executed first).
   * @param dependencies - A list of events that must be triggered before this event.
   */
  subscribe(
    event: string,
    eventType: EventType,
    callback: EventCallback,
    priority: number = 0,
    dependencies: string[] = []
  ): void {
    if (this.hasCyclicDependency(event, eventType, dependencies)) {
      throw new Error(`Cyclic dependency detected for event: ${event}`);
    }

    const entries = this.events[eventType].get(event) || [];
    entries.push({ callback, priority, dependencies });

    // Sort the event listeners by priority in descending order
    this.events[eventType].set(
      event,
      entries.sort((a, b) => b.priority - a.priority)
    );

    // Add the event to the waiting list of its dependencies
    dependencies.forEach((dep) => {
      const waiting = this.waitingEvents.get(dep) || new Map<string, any[]>();
      waiting.set(event, []);
      this.waitingEvents.set(dep, waiting);
    });
  }

  /**
   * Removes an event listener from the event bus.
   * If the event has no more listeners, it is removed entirely.
   * 
   * @param event - The name of the event to unsubscribe from.
   * @param eventType - The type of the event (e.g., regular, auth, method).
   * @param callback - The callback function to remove.
   */
  unsubscribe(
    event: string,
    eventType: EventType,
    callback: EventCallback
  ): void {
    const entries = this.events[eventType].get(event) || [];
    const filteredEntries = entries.filter(
      (entry) => entry.callback !== callback
    );

    if (filteredEntries.length > 0) {
      this.events[eventType].set(event, filteredEntries);
    } else {
      this.events[eventType].delete(event);
    }
  }

  /**
   * Triggers an event and executes its listeners.
   * If the event has dependencies, it ensures they are triggered first.
   * 
   * @param event - The name of the event to emit.
   * @param eventType - The type of the event (e.g., regular, auth, method).
   * @param args - Arguments to pass to the event listeners.
   */
  emit(event: string, eventType: EventType, ...args: any[]): void {
    const entries = this.events[eventType].get(event) || [];
    const executed: Set<string> = new Set();

    const executeEntry = (entry: EventEntry) => {
      try {
        entry.callback(...args);
        executed.add(event);
        this.triggerWaitingEvents(event, eventType, args);
      } catch (error) {
        console.error(
          `Error executing callback for event: ${event}. Args: ${JSON.stringify(
            args
          )}`,
          error
        );
      }
    };

    entries.forEach((entry) => {
      // Check if all dependencies have been triggered
      const unmetDependencies = entry.dependencies.filter(
        (dep) => !executed.has(dep)
      );

      // Trigger unmet dependencies first
      unmetDependencies.forEach((dep) => {
        if (!executed.has(dep)) {
          this.emit(dep, eventType, ...args);
          executed.add(dep); // Mark the dependency as executed
        }
      });

      // Execute the callback if all dependencies are met
      if (unmetDependencies.length === 0) {
        executeEntry(entry);
      }
    });

    // Update the arguments for waiting events
    this.updateWaitingEvents(event, args);
  }

  /**
   * Triggers events that are waiting for the specified event to complete.
   * 
   * @param event - The event that has been completed.
   * @param eventType - The type of the event (e.g., regular, auth, method).
   * @param args - Arguments to pass to the waiting events.
   */
  private triggerWaitingEvents(
    event: string,
    eventType: EventType,
    args: any[]
  ): void {
    this.processWaitingEvents(event, (dependentEvent, dependentArgs) => {
      this.emit(dependentEvent, eventType, ...dependentArgs);
    });
  }

  /**
   * Updates the arguments for events that are waiting for the specified event.
   * 
   * @param event - The event that has been completed.
   * @param args - The arguments to update for the waiting events.
   */
  private updateWaitingEvents(event: string, args: any[]): void {
    this.processWaitingEvents(event, (dependentEvent) => {
      const waiting = this.waitingEvents.get(event);
      if (waiting) waiting.set(dependentEvent, args);
    });
  }

  /**
   * A helper function to process events that are waiting for a specific event.
   * 
   * @param event - The event that has been completed.
   * @param callback - A callback function to execute for each waiting event.
   */
  private processWaitingEvents(
    event: string,
    callback: (dependentEvent: string, dependentArgs: any[]) => void
  ): void {
    const waiting = this.waitingEvents.get(event);
    if (!waiting) return;

    waiting.forEach((dependentArgs, dependentEvent) => {
      callback(dependentEvent, dependentArgs);
    });

    this.waitingEvents.delete(event);
  }
}
