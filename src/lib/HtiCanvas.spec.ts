import { HitCanvas } from "./HitCanvas";
import { CanvasController } from "./CanvasController";
import { createBlankCanvas } from "./utils";

describe("Hit canvas", () => {
  let canvas: CanvasController;

  beforeEach(() => {
    const canvasElement = createBlankCanvas();

    canvas = new CanvasController(canvasElement);
  });

  it("should create canvas context", () => {
    expect(new HitCanvas(canvas.element).context).toBeDefined();
  });
});
