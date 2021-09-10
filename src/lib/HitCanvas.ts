import ColorHash from "color-hash";
import { BaseCanvas } from "./BaseCanvas";
import { CanvasObject, ObjectEvents, Point } from "./CanvasObject";
import { getPointerPosition } from "./utils";

const colorHash = new ColorHash();

/**
 * HitCanvas is used to detect pointer events on CanvasObject.
 * Each object added to this canvas gets a unique color.
 * Triggers event if pixel color at pointer position matches generated CanvasObject color.
 */
export class HitCanvas extends BaseCanvas {
  private objectColors: WeakMap<CanvasObject, string> = new WeakMap();

  onClick = (event: MouseEvent) => {
    const object = this.getObjectAtPixel(getPointerPosition(event));

    if (!object) {
      return;
    }

    this.triggerEventOnObject(object, "click", event);
  };

  onPointerDown = (event: PointerEvent) => {
    const object = this.getObjectAtPixel(getPointerPosition(event));

    if (!object) {
      return;
    }

    this.triggerEventOnObject(object, "pointerdown", event);

    const onPointerUp: EventListener = event => {
      this.onPointerUpAfterDown(object, event as PointerEvent);
      event.target!.removeEventListener("pointerup", onPointerUp);
    };

    event.target!.addEventListener("pointerup", onPointerUp);
  };

  add<T extends CanvasObject>(object: T): T {
    super.add(object);
    this.addObjectColor(object);

    return object;
  }

  redraw() {
    this.objects.forEach(canvasObject => {
      const color = this.objectColors.get(canvasObject);

      if (!color) {
        console.warn(`${canvasObject.id} doesn't have hit color`);
        return;
      }

      this.context.fillStyle = color;
      this.context.strokeStyle = color;
      canvasObject.draw(this);
    });
  }

  /** Hit canvas should have any fill color */
  setFillStyle(_fillStyle: CanvasFillStrokeStyles["fillStyle"]) {}

  /** Hit canvas should have any stroke color */
  setStrokeStyle(_strokeStyle: CanvasFillStrokeStyles["strokeStyle"]) {}

  /**
   * Handler for Pointer up event after pointer down called
   */
  private onPointerUpAfterDown = (
    object: CanvasObject,
    event: PointerEvent
  ) => {
    this.triggerEventOnObject(object, "pointerup", event);
  };

  /**
   * Triggers event on canvas object if pixel color matches objects color hash
   */
  private triggerEventOnObject(
    object: CanvasObject,
    eventName: ObjectEvents,
    event: PointerEvent | MouseEvent
  ) {
    object.trigger(eventName, event);
  }

  private getObjectAtPixel(position: Point): CanvasObject | null {
    const color = this.getPixelColor(position);
    return (
      Array.from(this.objects.values()).find(object => {
        return this.objectColors.get(object) === color;
      }) || null
    );
  }

  /**
   * Returns color at specified pixel position on canvas.
   */
  private getPixelColor(point: Point): string {
    const { data: pixel } = this.context.getImageData(
      point.x * this.dpi,
      point.y * this.dpi,
      1,
      1
    );

    return `rgb(${pixel.slice(0, 3).join(",")})`;
  }

  /**
   * Generates unique color from object identifier
   */
  private addObjectColor(object: CanvasObject): string {
    const color = `rgb(${colorHash.rgb(object.id).join(",")})`;
    this.objectColors.set(object, color);
    return color;
  }
}
