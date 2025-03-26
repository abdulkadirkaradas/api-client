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

  /**
   * Belirli bir olaya abone olur.
   */
  subscribe(
    eventName: string,
    type: EventType,
    callback: EventCallback,
    priority = 0,
    dependencies: string[] = []
  ): void {
    const eventList = this.events[type].get(eventName) || [];
    eventList.push({ callback, priority, dependencies });
    eventList.sort((a, b) => b.priority - a.priority);
    this.events[type].set(eventName, eventList);
  }

  /**
   * Belirli bir olaydan aboneliği kaldırır.
   */
  unsubscribe(
    eventName: string,
    type: EventType,
    callback: EventCallback
  ): void {
    const eventList = this.events[type].get(eventName);
    if (eventList) {
      this.events[type].set(
        eventName,
        eventList.filter((entry) => entry.callback !== callback)
      );
    }
  }

  /**
   * Belirli bir olayı tetikler.
   */
  emit(eventName: string, type: EventType, ...args: any[]): void {
    const emittedEvents = new Set<string>();
    const processedEvents = new Set<string>();

    const trigger = (name: string) => {
      if (processedEvents.has(name)) return; // Daha önce işlendi mi? Öyleyse çık.

      const eventList = this.events[type].get(name);
      if (!eventList) return; // Eğer event yoksa çık.

      processedEvents.add(name); // İşlenmiş event olarak işaretle.

      for (const entry of eventList) {
        // Önce bağımlı event'leri sırayla tetikle
        for (const dep of entry.dependencies) {
          if (!processedEvents.has(dep)) {
            trigger(dep);
          }
        }

        // Eğer bağımlılıkların tamamı tetiklendiyse çalıştır
        if (entry.dependencies.every((dep) => emittedEvents.has(dep))) {
          entry.callback(...args);
          emittedEvents.add(name); // Çalıştırılan event'i kaydet
        }
      }
    };

    trigger(eventName);
  }

  /**
   * Belirli bir olayın tüm aboneliklerini temizler.
   */
  clear(type: EventType, eventName: string): void {
    this.events[type].delete(eventName);
  }

  /**
   * Belirli bir olay tipinin tüm aboneliklerini temizler.
   */
  clearType(type: EventType): void {
    this.events[type].clear();
  }

  /**
   * Tüm olay aboneliklerini temizler.
   */
  clearAll(): void {
    Object.values(this.events).forEach((map) => map.clear());
  }
}
