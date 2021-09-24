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
    object.on("change", this.onObjectChange);
    this.onObjectChange();
    return object;
  }

  remove<T extends CanvasObject>(object: T): void {
    super.remove(object);
    object.off("change", this.onObjectChange);
    this.onObjectChange();
    this.hitCanvas.remove(object);
  }

  redraw() {
    super.redraw();
    this.hitCanvas.clear();
    this.hitCanvas.redraw();
  }

  clear() {
    super.clear();
  }

  destroy() {
    this.element.removeEventListener("click", this.hitCanvas.onClick);
    this.element.removeEventListener(
      "pointerdown",
      this.hitCanvas.onPointerDown
    );
    this.element.removeEventListener("click", this.onClick);
    super.destroy();
    this.hitCanvas.destroy();
  }

  private onObjectChange = () => {
    this.hasChanges = true;
    this.redraw();
  };

  private onClick = (event: MouseEvent) => {
    this.events.trigger("click", {
      ...event,
      data: getPointerPosition(event),
    });
  };
}
