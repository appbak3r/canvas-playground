import { fireEvent } from "@testing-library/react";
import { CanvasController } from "./CanvasController";
import { CircleObject } from "./shapes/CircleObject";
import { createBlankCanvas } from "./utils";

describe("CanvasController", () => {
  let canvas: CanvasController;
  let redrawSpy: jest.SpyInstance;
  let requestAnimationFrameSpy: jest.SpyInstance;

  beforeEach(() => {
    const canvasElement = createBlankCanvas();

    requestAnimationFrameSpy = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(((cb: Function) => cb()) as any);

    canvas = new CanvasController(canvasElement);
    redrawSpy = jest.spyOn(canvas, "redraw");
  });

  afterEach(() => {
    redrawSpy.mockClear();
    requestAnimationFrameSpy.mockRestore();
  });

  it("should accept canvas controller and have 2d context", () => {
    expect(canvas.context).toBeDefined();
  });

  it("should set height and width with default DPI=1", () => {
    canvas.configure({
      width: 100,
      height: 200,
    });
    expect(canvas.width).toEqual(100);
    expect(canvas.height).toEqual(200);
  });

  it("should redraw after configure called", () => {
    canvas.configure({
      width: 100,
      height: 200,
    });
    expect(canvas.width).toEqual(100);
    expect(canvas.height).toEqual(200);
  });

  it("should multiply height and width by DPI", () => {
    const dpi = Math.trunc(Math.random() * 10);

    canvas.configure({
      width: 100,
      height: 200,
      dpi,
    });

    expect(canvas.width).toEqual(100 * dpi);
    expect(canvas.height).toEqual(200 * dpi);
  });

  it("should be blank by default", () => {
    const blankCanvas = createBlankCanvas(canvas.width, canvas.height);

    expect(canvas.element.toDataURL()).toEqual(blankCanvas.toDataURL());
  });

  it("should draw object on canvas", () => {
    const object = new CircleObject({ x: 10, y: 10, radius: 10, fill: "red" });
    canvas.add(object);
    canvas.redraw();

    const blankCanvas = createBlankCanvas(canvas.width, canvas.height);

    expect(redrawSpy).toHaveBeenCalled();
    expect(canvas.element.toDataURL()).not.toEqual(blankCanvas.toDataURL());
  });

  it("should clear canvas", () => {
    const object = new CircleObject({ x: 10, y: 10, radius: 10, fill: "red" });
    canvas.add(object);

    const blankCanvas = createBlankCanvas(canvas.width, canvas.height);

    canvas.clear();

    expect(canvas.element.toDataURL()).toEqual(blankCanvas.toDataURL());
  });

  it("should redraw object after changing it's properties", () => {
    const object = new CircleObject({ x: 10, y: 10, radius: 10, fill: "red" });
    canvas.add(object);
    canvas.redraw();

    const previousState = canvas.element.toDataURL();

    object.configure({ x: 20, y: 20, radius: 10 });
    canvas.redraw();

    expect(canvas.element.toDataURL()).not.toEqual(previousState);
  });

  it("should remove object", () => {
    const object = new CircleObject({ x: 10, y: 10, radius: 10, fill: "red" });
    canvas.add(object);
    canvas.redraw();

    const previousState = canvas.element.toDataURL();

    canvas.remove(object);
    canvas.redraw();

    expect(canvas.element.toDataURL()).not.toEqual(previousState);
  });

  it("should remove objects & clear canvas on destroy", () => {
    const object = new CircleObject({ x: 10, y: 10, radius: 10, fill: "red" });
    canvas.add(object);
    canvas.destroy();
    canvas.redraw();
    expect(canvas.element.toDataURL()).toEqual(createBlankCanvas().toDataURL());
  });

  it("should add click event listeners", () => {
    const fn = jest.fn();

    canvas.events.on("click", fn);
    fireEvent.click(canvas.element);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should remove event listeners on destroy", () => {
    const fn = jest.fn();
    canvas.events.on("click", fn);
    canvas.destroy();
    fireEvent.click(canvas.element);
    expect(fn).not.toBeCalled();
  });
});
