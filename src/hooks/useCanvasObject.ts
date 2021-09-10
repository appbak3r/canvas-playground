import { ForwardedRef, useContext, useLayoutEffect, useMemo } from "react";
import { SurfaceContext } from "../components/SurfaceContext";
import { CanvasObject } from "../lib/CanvasObject";

type Newable<T> = { new (...args: any[]): T };

export type CanvasObjectProps<T> = {
  onClick?: (event: MouseEvent) => void;
  onChange?: (config: T) => void;
} & T;

export const useCanvasObject = <T extends CanvasObject, P>(
  CanvasObjectConstructor: Newable<T>,
  { onClick, onChange, ...config }: CanvasObjectProps<P>,
  ref: ForwardedRef<T>
) => {
  const { canvas } = useContext(SurfaceContext);

  const canvasObject = useMemo(() => {
    return new CanvasObjectConstructor(config);
  }, [config, CanvasObjectConstructor]);

  useLayoutEffect(() => {
    if (typeof ref === "function") {
      ref(canvasObject);
    } else if (ref) {
      ref.current = canvasObject;
    }
  }, [canvasObject, ref]);

  useLayoutEffect(() => {
    canvasObject.configure(config);
  }, [config, canvasObject]);

  useLayoutEffect(() => {
    const handleClick = (event: MouseEvent) => {
      onClick?.(event);
    };

    canvas.add(canvasObject);
    onChange?.(canvasObject.config);
    canvasObject.on("click", handleClick);

    if (onChange) {
      canvasObject.on("change", onChange);
    }

    return () => {
      canvas.remove(canvasObject);
      canvasObject.off("click", handleClick);

      if (onChange) {
        canvasObject.off("change", onChange);
      }
    };
  }, [canvas, canvasObject, onClick, onChange]);

  return canvasObject;
};
