import { BaseCanvas, CanvasConfig } from "./BaseCanvas";
import { CanvasObject } from "./CanvasObject";
import { HitCanvas } from "./HitCanvas";
import { createBlankCanvas, getPointerPosition } from "./utils";
import { CanvasEventMachine } from "./CanvasEventMachine";

export class CanvasController extends BaseCanvas {
  private hitCanvas: HitCanvas;
  public events = new CanvasEventMachine();

  constructor(element: HTMLCanvasElement) {
    super(element);
    this.hitCanvas = new HitCanvas(createBlankCanvas());
    this.element.addEventListener("click", this.hitCanvas.onClick);
    this.element.addEventListener("pointerdown", this.hitCanvas.onPointerDown);
    this.element.addEventListener("click", this.onClick);
    this.clear();
  }

  configure(config: Partial<CanvasConfig>): void {
    super.configure(config);
    this.hitCanvas.configure(config);
  }

  add<T extends CanvasObject>(object: T): T {
    super.add(object);
    this.hitCanvas.add(object);
    return object;
  }

  remove<T extends CanvasObject>(object: T): void {
    super.remove(object);
    this.hitCanvas.remove(object);
  }

  redraw() {
    super.redraw();
    this.hitCanvas.redraw();
  }

  clear() {
    super.clear();
    this.hitCanvas.clear();
  }

  destroy() {
    super.destroy();
    this.hitCanvas.destroy();
  }

  private onClick = (event: MouseEvent) => {
    this.events.trigger("click", {
      ...event,
      data: getPointerPosition(event),
    });
  };
}
