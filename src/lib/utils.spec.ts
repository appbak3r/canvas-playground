import { Point } from "./CanvasObject";
import { getDistanceBetweenCoords, getCircleRadiusByArea } from "./utils";

describe("utils", () => {
  it("should calculate circle radius correctly", () => {
    const radius = Math.trunc(Math.random() * 100);
    const area = Math.PI * Math.pow(radius, 2);

    expect(getCircleRadiusByArea(area)).toEqual(radius);
  });

  it("should calculate distance correctly", () => {
    const lineLength = Math.trunc(Math.random() * 100);

    const a: Point = {
      x: 0,
      y: 0,
    };

    const b: Point = {
      x: lineLength,
      y: 0,
    };

    expect(getDistanceBetweenCoords(a, b)).toEqual(lineLength);
  });
});
