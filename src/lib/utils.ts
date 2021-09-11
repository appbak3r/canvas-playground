import { Point } from "./CanvasObject";

export const createBlankCanvas = (
  width: number = 100,
  height: number = 100
): HTMLCanvasElement => {
  const canvasElement = document.createElement("canvas");

  canvasElement.width = width;
  canvasElement.height = height;

  return canvasElement;
};

/**
 * Calculates pointer position respecting canvas offset
 */
export const getPointerPosition = (event: PointerEvent | MouseEvent): Point => {
  const DOMRect = (event.target as HTMLCanvasElement).getBoundingClientRect();

  return {
    x: event.clientX - DOMRect.x,
    y: event.clientY - DOMRect.y,
  };
};

export const getDistanceBetweenCoords = (a: Point, b: Point): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

/**
 * Calculates triangle area using Herons formula.
 * @see https://www.mathsisfun.com/geometry/herons-formula.html
 */
export const getTriangleArea = (...points: Point[]) => {
  const [a, b, c] = points;
  const AB = getDistanceBetweenCoords(a, b);
  const AC = getDistanceBetweenCoords(a, c);
  const BC = getDistanceBetweenCoords(b, c);

  const perimeter = (AB + AC + BC) / 2;

  return Math.sqrt(
    perimeter * (perimeter - AB) * (perimeter - AC) * (perimeter - BC)
  );
};

/**
 * Calculates parallelogram area by finding sub triangle area
 */
export const getParallelogramArea = (...points: Point[]): number => {
  return parseFloat((getTriangleArea(...points) * 2).toFixed(2));
};

export const getCircleRadiusByArea = (area: number) => {
  return Math.sqrt(area / Math.PI);
};
