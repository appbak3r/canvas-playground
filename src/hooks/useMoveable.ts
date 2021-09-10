import { useContext, useLayoutEffect } from "react";
import { CanvasObject, Point } from "../lib/CanvasObject";
import { SurfaceContext } from "../components/SurfaceContext";

export const useMoveable = (
  object: CanvasObject,
  onMove: (delta: Point) => void
) => {
  const { canvas } = useContext(SurfaceContext);

  useLayoutEffect(() => {
    const handlePointerDown = () => {
      canvas.element.addEventListener("pointermove", handlePointerMove);
    };
    const handlePointerUp = () => {
      canvas.element.removeEventListener("pointermove", handlePointerMove);
    };

    const handlePointerMove = (event: PointerEvent) => {
      onMove({ x: event.movementX, y: event.movementY });
    };

    object.on("pointerdown", handlePointerDown);
    object.on("pointerup", handlePointerUp);

    return () => {
      object.off("pointerdown", handlePointerDown);
      object.off("pointerup", handlePointerUp);
      canvas.element.removeEventListener("pointermove", handlePointerMove);
    };
  }, [object, canvas.element, onMove]);
};
