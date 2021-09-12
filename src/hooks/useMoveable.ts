import { useContext, useLayoutEffect, useRef } from "react";
import { CanvasObject, Point } from "../lib/CanvasObject";
import { SurfaceContext } from "../components/SurfaceContext";

export const useMoveable = (
  object: CanvasObject,
  onMove: (delta: Point) => void
) => {
  const { canvas } = useContext(SurfaceContext);

  const moveStart = useRef<Point | null>(null);

  useLayoutEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      moveStart.current = {
        x: event.clientX,
        y: event.clientY,
      };
      canvas.element.addEventListener("pointermove", handlePointerMove);
    };
    const handlePointerUp = () => {
      moveStart.current = null;
      canvas.element.removeEventListener("pointermove", handlePointerMove);
    };

    const handlePointerMove = (event: PointerEvent) => {
      onMove({
        x: Math.floor(event.clientX - moveStart.current!.x),
        y: Math.floor(event.clientY - moveStart.current!.y),
      });

      moveStart.current = {
        x: event.clientX,
        y: event.clientY,
      };
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
