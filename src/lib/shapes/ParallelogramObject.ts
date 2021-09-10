import { CanvasController } from "../CanvasController";
import { CanvasObject, CanvasObjectConfig, Point } from "../CanvasObject";

export type ParallelogramObjectConfig = CanvasObjectConfig<{
  a: Point;
  b: Point;
  c: Point;
  d?: Point;
}>;

export class ParallelogramObject extends CanvasObject<ParallelogramObjectConfig> {
  draw(canvas: CanvasController): void {
    const { a, b, c, d } = this.config as Required<ParallelogramObjectConfig>;

    const { context } = canvas;

    canvas.context.beginPath();

    context.moveTo(a.x * canvas.dpi, a.y * canvas.dpi);

    this.drawLine(canvas, b);
    this.drawLine(canvas, c);
    this.drawLine(canvas, d);
    this.drawLine(canvas, a);

    canvas.context.closePath();

    super.draw(canvas);
  }

  configure(config: Partial<ParallelogramObjectConfig>, silent?: boolean) {
    this.config = Object.assign({}, this.config, config);

    this.updateFourthCoord();

    super.configure(this.config, silent);
  }

  updateFourthCoord() {
    const { a, b, c } = this.config;
    this.config.d = { x: a.x + c.x - b.x, y: a.y + c.y - b.y };
    return this.config.d;
  }

  private drawLine(canvas: CanvasController, end: Point) {
    const { context } = canvas;

    context.lineTo(end.x * canvas.dpi, end.y * canvas.dpi);
  }
}
