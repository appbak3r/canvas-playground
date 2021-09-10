import { getCircleRadiusByArea } from "./utils";

describe("utils", () => {
  it("should calculate circle radius correctly", () => {
    const radius = Math.trunc(Math.random() * 100);
    const area = Math.PI * Math.pow(radius, 2);

    expect(getCircleRadiusByArea(area)).toEqual(radius);
  });
});
