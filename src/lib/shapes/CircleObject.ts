import { CanvasController } from "../CanvasController";
import { CanvasObject, CanvasObjectConfig } from "../CanvasObject";

export type CircleObjectConfig = CanvasObjectConfig<{
  x: number;
  y: number;
  radius: number;
}>;

export class CircleObject extends CanvasObject<CircleObjectConfig> {
  draw(canvas: CanvasController): void {
    const { x, y, radius } = this.config;

    const point = {
      x: x * canvas.dpi,
      y: y * canvas.dpi,
    };

    canvas.context.beginPath();
    canvas.context.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    canvas.context.closePath();

    super.draw(canvas);
  }
}
