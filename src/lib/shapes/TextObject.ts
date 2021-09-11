import { CanvasObject, CanvasObjectConfig } from "../CanvasObject";
import { CanvasController } from "../CanvasController";

export type TextObjectConfig = CanvasObjectConfig<{
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
}>;

export class TextObject extends CanvasObject<TextObjectConfig> {
  draw(canvas: CanvasController): void {
    const { text, x, y, fontSize, fontFamily, lineHeight = 1.33 } = this.config;

    if (fontSize) {
      canvas.setFontSize(fontSize);
    }

    if (fontFamily) {
      canvas.setFontFamily(fontFamily);
    }

    if (this.config.fill) {
      canvas.setFillStyle(this.config.fill);
    }

    text.split("\n").forEach((text, i) => {
      canvas.context.fillText(
        text,
        x * canvas.dpi,
        y * canvas.dpi + canvas.fontSize * lineHeight * canvas.dpi * i
      );
    });

    canvas.clearStyle();
  }
}
