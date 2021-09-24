import { CanvasObject } from "./CanvasObject";

export type CanvasConfig = {
  width: number;
  height: number;
  dpi: number;
  font: {
    size: number;
    family: string;
  };
};

export class BaseCanvas {
  readonly context: CanvasRenderingContext2D;
  readonly element: HTMLCanvasElement;
  protected readonly objects: Map<string, CanvasObject> = new Map();
  protected hasChanges = false;

  private config: CanvasConfig = {
    dpi: 1,
    width: 100,
    height: 100,
    font: {
      size: 12,
      family: "Courier New",
    },
  };

  get width(): number {
    return this.element.width;
  }

  get height(): number {
    return this.element.height;
  }

  get dpi(): number {
    return this.config.dpi;
  }

  get fontSize(): number {
    return this.config.font.size;
  }

  constructor(element: HTMLCanvasElement) {
    this.element = element;
    this.context = this.element.getContext("2d") as CanvasRenderingContext2D;
  }

  configure(config: Partial<CanvasConfig>): void {
    this.config = Object.assign({}, this.config, config);
    const { width, height, dpi } = this.config;

    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.width = width * dpi;
    this.element.height = height * dpi;
    this.hasChanges = true;
    this.redraw();
  }

  /**
   * Clears canvas and draws all added objects
   */
  redraw(): void {
    if (!this.hasChanges) {
      return;
    }

    this.hasChanges = false;

    window.requestAnimationFrame(() => {
      this.clear();
      this.objects.forEach(canvasObject => {
        canvasObject.draw(this);
      });
    });
  }

  /**
   * Clears canvas
   */
  clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
    this.clearStyle();
  }

  clearStyle(): void {
    this.context.fillStyle = "#00000000";
    this.context.strokeStyle = "#00000000";
  }

  add<T extends CanvasObject>(object: T): T {
    this.objects.set(object.id, object);
    return object;
  }

  remove<T extends CanvasObject>(object: T): void {
    this.objects.delete(object.id);
  }

  destroy() {
    this.objects.clear();
    this.clear();
  }

  setFillStyle(fillStyle: CanvasFillStrokeStyles["fillStyle"]) {
    this.context.fillStyle = fillStyle;
  }

  setStrokeStyle(strokeStyle: CanvasFillStrokeStyles["strokeStyle"]) {
    this.context.strokeStyle = strokeStyle;
  }

  setFontSize(fontSize: number) {
    this.config.font.size = fontSize;
    this.context.font = `${this.config.font.size * this.dpi}px ${
      this.config.font.family
    }`;
  }

  setFontFamily(fontFamily: string) {
    this.config.font.family = fontFamily;
    this.context.font = `${this.config.font.size * this.dpi}px ${
      this.config.font.family
    }`;
  }
}
