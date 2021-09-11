import { ParallelogramObject } from "./ParallelogramObject";

describe("Canvas | Shapes | Parallelogram", () => {
  it("should set D point on configure", () => {
    const canvasObject = new ParallelogramObject({
      a: { x: 0, y: 0 },
      b: { x: 1, y: 2 },
      c: { x: 2, y: 3 },
    });

    expect(canvasObject.config.d).toBeUndefined();

    canvasObject.configure({});
    expect(canvasObject.config.d).toBeDefined();
  });

  it("should find center correctly", () => {
    const canvasObject = new ParallelogramObject({
      a: { x: 0, y: 0 },
      b: { x: 2, y: 0 },
      c: { x: 2, y: 2 },
    });

    canvasObject.configure({});
    expect(canvasObject.getCenter()).toMatchObject({ x: 1, y: 1 });
  });

  it("should find area correctly", () => {
    const canvasObject = new ParallelogramObject({
      a: { x: 0, y: 0 },
      b: { x: 2, y: 0 },
      c: { x: 2, y: 2 },
    });

    canvasObject.configure({});
    expect(canvasObject.getArea()).toEqual(4);
  });
});
