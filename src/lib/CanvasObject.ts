import { nanoid } from "nanoid";
import event, { Listener, Event } from "evnty";
import { BaseCanvas } from "./BaseCanvas";

export type Point = {
  x: number;
  y: number;
};

export type CanvasObjectConfig<T> = {
  color?: string;
  fill?: string;
  stroke?: string;
} & T;

export type ObjectEvents = "click" | "pointerup" | "pointerdown" | "change";

type EventTypes<T = any> = {
  click: MouseEvent;
  pointerup: PointerEvent;
  pointerdown: PointerEvent;
  change: CanvasObjectConfig<T>;
};

export abstract class CanvasObject<T = any> {
  id: string;
  config: CanvasObjectConfig<T>;

  private events: Record<ObjectEvents, Event> = {
    click: event(),
    pointerdown: event(),
    pointerup: event(),
    change: event(),
  };

  constructor(config: CanvasObjectConfig<T>) {
    this.id = nanoid();
    this.config = Object.assign({}, config);
  }

  /**
   * Draws object in the provided context.
   */
  draw(canvas: BaseCanvas, shouldClearStyles = true, ...args: any): void {
    if (this.config.fill) {
      canvas.setFillStyle(this.config.fill);
    }

    if (canvas.context.fillStyle) {
      canvas.context.fill();
    }

    if (this.config.stroke) {
      canvas.setStrokeStyle(this.config.stroke);
    }

    if (canvas.context.strokeStyle) {
      canvas.context.stroke();
    }

    if (shouldClearStyles) {
      canvas.clearStyle();
    }
  }

  configure(config: Partial<CanvasObjectConfig<T>>, silent = false): void {
    this.config = Object.assign({}, this.config, config);
    if (!silent) {
      this.trigger("change", this.config);
    }
  }

  on(event: ObjectEvents, listener: Listener) {
    this.events[event].on(listener);
  }

  off(event: ObjectEvents, listener: Listener) {
    this.events[event].off(listener);
  }

  trigger<TEvent extends ObjectEvents>(
    eventName: TEvent,
    event: EventTypes<T>[TEvent]
  ): void {
    this.events[eventName](event);
  }
}
