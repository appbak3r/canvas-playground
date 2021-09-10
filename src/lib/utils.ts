export const createBlankCanvas = (
  width: number = 100,
  height: number = 100
): HTMLCanvasElement => {
  const canvasElement = document.createElement("canvas");

  canvasElement.width = width;
  canvasElement.height = height;

  return canvasElement;
};
