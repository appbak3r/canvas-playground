import event, { Event, Listener } from "evnty";

export type Events = "click" | "pointerup" | "pointerdown";

type EventTypes<T = any> = {
  click: MouseEvent;
  pointerup: PointerEvent;
  pointerdown: PointerEvent;
} & T;

export class CanvasEventMachine<T = any> {
  private events: Record<Events, Event> = {
    click: event(),
    pointerdown: event(),
    pointerup: event(),
  };

  on(event: Events, listener: Listener) {
    this.events[event].on(listener);
  }

  off(event: Events, listener: Listener) {
    this.events[event].off(listener);
  }

  trigger<TEvent extends Events>(
    eventName: TEvent,
    event: EventTypes<T>[TEvent]
  ): void {
    this.events[eventName](event);
  }
}
